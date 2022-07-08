import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {PortableText} from '@portabletext/react'
import EmbedHTML from './EmbedHTML'
import Figure from './Figure'
import styles from './SimpleBlockContent.module.css'
import { client } from '../utils/sanityClient'
import Link from 'next/link'
import { getPathFromSlug } from '../utils/urls'
function SimpleBlockContent(props) {
  const { blocks } = props
  const [internalBlocks, setInternalBlocks] = useState([])
  if (!blocks) {
    return null
  }
  useEffect(async() => {
    let marks = []
    for(let i = 0; i < blocks.length; i++) {
      const { markDefs } = blocks[i]
      if(markDefs) {
        for(let j = 0; j < markDefs.length; j++) {
          if(!marks.find(ele => ele._key === markDefs[j]._key)){
            marks.push(markDefs[j])
          }
        }
      }
    }
    if(marks.length > 0) {
      const idMarks = marks.map(i => `'${i._ref}'`)
      client.fetch(`*[_type == "route" && _id in [${idMarks}]]{
        _id,
        slug{
          _type,
          current
        }
      }`)
      .then(data => {
        let newBlocks = blocks.map(i => i)
        for(let i = 0; i < newBlocks.length; i++) {
          let { markDefs } = newBlocks[i]
          if(markDefs) {
            for(let j = 0; j < markDefs.length; j++) {
              if(data.find(ele => ele._id === markDefs[j]._ref)){
                let { slug } = data.find(ele => ele._id === markDefs[j]._ref)
                markDefs[j].slug = slug
              }
            }
            newBlocks[i].markDefs = markDefs
          }
        }
        setInternalBlocks(newBlocks)
      })
    } else {
      setInternalBlocks(blocks)
    }
  }, [blocks])
  return (
    <PortableText
      value={internalBlocks}
      components={{
        types: {
          embedHTML:(props)=> <EmbedHTML node={{...props.value}}/>,
          figure:(props) => <Figure node={{...props.value}}/>,
        },
        marks: {
          internalLink: (props) => {
            const {value = {}, children} = props
            const {slug = {}} = value
            const href = `/${slug.current}`
          
            return  (
              <Link href={getPathFromSlug(href)}>
                <a  className={styles.navItemLink}>
                  &nbsp;{children}&nbsp;
                </a>
              </Link>
            )
          },
          link: (props) => {
            return <a href={props.value.href} className={styles.navItemLink} style={{textDecoration: 'underline'}}>{props.children}</a>
          },
          del: ({children}) => <del>{children}</del>,
          color: (props) => {
            const { children, value } = props

            return (
              <span style={{color: value.hex}}>
                {children}
              </span>
            )
          }
        },
        list: {
          bullet: ({children}) => <ul>{children}</ul>,
          number: ({children}) => <ol>{children}</ol>,
        },
        listItem: {
          bullet: ({children}) => <li>🔸 {children}</li>,
        }
      }}
    />
  )
}

SimpleBlockContent.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object),
}

export default SimpleBlockContent
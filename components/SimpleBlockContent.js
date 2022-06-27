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
      for(let j = 0; j < markDefs.length; j++) {
        if(!marks.find(ele => ele._key === markDefs[j]._key)){
          marks.push(markDefs[j])
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
          for(let j = 0; j < markDefs.length; j++) {
            if(data.find(ele => ele._id === markDefs[j]._ref)){
              let { slug } = data.find(ele => ele._id === markDefs[j]._ref)
              markDefs[j].slug = slug
            }
          }
          newBlocks[i].markDefs = markDefs
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
          }
        },
        block: {
          normal: ({children}) => <p className={styles.normalText}>{children}</p>
        },
      }}
    />
  )
}

SimpleBlockContent.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object),
}

export default SimpleBlockContent
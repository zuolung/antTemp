import { PlusOutlined } from '@ant-design/icons'
import { Modal, Upload, message } from 'antd'
import { useState, useEffect } from 'react'

message.config({
  duration: 2,
  top: 200,
})

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = (error) => reject(error)
  })

type Iprops = {
  limit?: number
  value?: string[] | string
  onChange?: (v: string[] | string) => void
  maxSize?: number
  accept?: string
}

function UploadImage(props: Iprops): JSX.Element {
  const {
    limit = 5,
    value,
    accept,
    onChange,
    maxSize = 5 * 1024 * 1024,
  } = props

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState<{ name: string; url: string }[]>([])

  useEffect(
    function () {
      if (value !== '' || value !== undefined) {
        let value__: string[] = []
        if (limit === 1 && typeof value === 'string') {
          if (!value) {
            value__ = []
          } else {
            value__ = [value]
          }
        } else if (Array.isArray(value)) {
          value__ = value
        }

        setFileList(
          value__.map((item, index) => {
            return {
              name: `图${index}`,
              url: item,
            }
          }),
        )
      }
    },
    [limit, value],
  )

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle('图片查看')
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传图片
      </div>
    </div>
  )

  const beforeUpload = async (file) => {
    message.loading('上传中...')
    if (file.size > maxSize) {
      message.destroy()
      message.error(
        `上传的图片不能大于${(maxSize / (1024 * 1024)).toFixed(2)}M`,
      )

      return false
    }

    return true
  }

  const handleChange = (e) => {
    const { file } = e
    if (file.response && file.response.success) {
      message.destroy()

      const valueNew: any[] = fileList
        .map((item) => item.url)
        .concat(file.response.data)

      onChange?.(limit === 1 ? valueNew[0] : valueNew)
    }
  }

  const onRemove = (e) => {
    const { url } = e
    const valueNew: any = []
    fileList.map((item) => {
      if (item.url !== url) {
        valueNew.push(item.url)
      }
    })

    onChange?.(limit === 1 ? '' : [...valueNew])
  }

  return (
    <div>
      <Upload
        name="file"
        listType="picture-card"
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        action="/z/api/1.0/uploadImage"
        onRemove={onRemove}
        accept={accept || 'image/*, .pdf'}
        fileList={fileList as any}
      >
        {fileList.length >= limit ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  )
}

export default UploadImage

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'
import { PickerInline } from 'filestack-react' //  There is a known error => https://github.com/filestack/filestack-react/issues/116
import FilestackPicker from 'src/components/FilestackPicker' // Instead, create your own component(FilestackPicker) described in the above Issue and support it.
import { useState } from 'react'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

const clientOptions = () => {
  const expiry = int(time.time()) + 15 * 60; // Policy is valid for 15 minutes
  const jsonPolicy = { 'call': [], 'expiry': expiry };
  const security = filestack.getSecurity(jsonPolicy, process.env.REDWOOD_ENV_FILESTACK_SECRET);
  security['policy'] = security['policy'].decode('ascii');
  return security
}

const ImageForm = (props) => {
  const [url, setUrl] = useState(props?.image?.url)

  const onSubmit = (data) => {
    const dataWithUrl = Object.assign(data, { url })
    props.onSave(dataWithUrl, props?.image?.id)
  }

  const onFileUpload = (response) => {
    setUrl(response.filesUploaded[0].url)
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="title"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Title
        </Label>
        <TextField
          name="title"
          defaultValue={props.image?.title}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="title" className="rw-field-error" />

        {/* <PickerInline
          apikey={process.env.REDWOOD_ENV_FILESTACK_API_KEY}
          onSuccess={onFileUpload}
        >
          <div style={{ display: url ? 'none' : 'block', height: '500px' }}></div>
        </PickerInline> */}

        <FilestackPicker
          apikey={process.env.REDWOOD_ENV_FILESTACK_API_KEY}
          clientOptions={clientOptions}
          onSuccess={onFileUpload}
        >
          <div style={{ display: url ? 'none' : 'block', height: '500px' }}></div>
        </FilestackPicker>

        {url && (
          <div>
            <img src={url} style={{ display: 'block', margin: '2rem 0' }} />
            <button
              onClick={() => setUrl(null)}
              className="rw-button rw-button-blue"
            >
              Replace Image
            </button>
          </div>
        )}

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ImageForm
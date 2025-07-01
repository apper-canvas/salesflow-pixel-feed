import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const FormField = ({ 
  type = 'text',
  field,
  form,
  options,
  ...props 
}) => {
  const fieldProps = {
    ...field,
    ...props,
    error: form.touched[field.name] && form.errors[field.name]
  }

  if (type === 'select') {
    return <Select {...fieldProps} options={options} />
  }

  if (type === 'textarea') {
    return (
      <div className="w-full">
        {props.label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {props.label}
          </label>
        )}
        <textarea
          {...fieldProps}
          className={`input-field min-h-[100px] resize-vertical ${fieldProps.error ? 'border-error focus:ring-error/50 focus:border-error' : ''}`}
        />
        {fieldProps.error && (
          <p className="mt-1 text-sm text-error">{fieldProps.error}</p>
        )}
      </div>
    )
  }

  return <Input type={type} {...fieldProps} />
}

export default FormField
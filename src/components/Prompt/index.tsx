/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, FormInstance, Modal } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import { Props, PromptProps, PromptConfig } from './types';

const PromptForm = forwardRef(({ renderItem, formProps, form }: Props, ref: any) => {
  const [f] = Form.useForm<FormInstance<any> | null>(form);
  useEffect(() => {
    if (formProps?.initialValues) {
      f.setFieldsValue(formProps?.initialValues);
    }
  }, []);
  useImperativeHandle(ref, () => ({
    validate: () => {
      return f?.validateFields().then((res) => res);
    },
    getValues: () => f?.getFieldsValue(true),
  }));

  return (
    <React.Fragment>
      <Form
        colon={false}
        form={f}
        {...(formProps || null)}
        labelWrap
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        labelAlign="left"
      >
        {renderItem}
      </Form>
    </React.Fragment>
  );
});

PromptForm.displayName = 'PromptForm';

function Prompt({
  rules,
  modalProps = {},
  visible,
  submit,
  close,
  formProps,
  afterClose,
  title,
  renderError,
  renderItem,
}: PromptProps) {
  const formRef = React.useRef<any>(null);
  const [form] = Form.useForm<FormInstance<any> | null>(formProps?.form);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const handleOk = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await formRef.current?.validate();
      const value = await formRef.current?.getValues();
      await submit(
        form,
        () => setTimeout(() => setIsLoading(false), 500),
        (mgs) => {
          setErrorMessage(mgs);
          setTimeout(() => setIsLoading(false), 500);
        },
        value
      );
    } catch (e) {
      //
    }
  };
  return (
    <Modal
      {...modalProps}
      visible={visible}
      confirmLoading={isLoading}
      onOk={handleOk}
      onCancel={() => close()}
      title={title}
      getContainer={false}
      afterClose={afterClose}
    >
      <PromptForm
        form={form}
        ref={formRef}
        rules={rules}
        renderItem={renderItem}
        formProps={formProps}
      />
      {errorMessage &&
        (renderError ? (
          renderError(errorMessage)
        ) : (
          <span style={{ color: '#ff4d4f', fontSize: 18 }}>Error: {errorMessage}</span>
        ))}
    </Modal>
  );
}

export default function prompt(config: PromptConfig): void {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const { onOk, ...others } = config;
  let currentConfig: PromptProps = {
    ...others,
    close,
    submit,
    visible: true,
  };
  const destroy = (value?: any) => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    return;
  };
  function close(value?: any) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: () => destroy(value),
    };
    render(currentConfig);
  }
  async function submit(
    ref: FormInstance,
    finish?: () => void,
    error?: (mgs: string) => void,
    value?: any
  ) {
    if (onOk) {
      await onOk(
        ref,
        value,
        () => close(value),
        () => finish && finish(),
        (mgs) => error && error(mgs)
      );
    }
  }
  function render(props: PromptProps) {
    ReactDOM.render(<Prompt {...props}></Prompt>, div);
  }
  render(currentConfig);
}

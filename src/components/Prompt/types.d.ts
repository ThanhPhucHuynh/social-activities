import { FormInstance, FormProps } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { Rule } from 'antd/lib/form';
import { BooleanArraySupportOption } from 'prettier';
import React, { ReactNode } from 'react';

export interface Props {
  rules?: Rule[];
  ref?: any;
  onPressEnter?: () => void;
  renderItem?: ReactNode;
  formProps?: FormProps;
  form?: FormInstance;
}
export interface PromptConfig {
  title: string;
  rules?: Rule[];
  modalProps?: Partial<ModalProps>;
  onOk?: (
    ref: FormInstance,
    value: any,
    close: () => void,
    finish: () => void,
    error: (mgs: string) => void
  ) => void;
  renderItem?: ReactNode;
  formProps?: FormProps;
  renderError?: (mgs: string) => ReactNode;
}
export interface PromptProps extends Props {
  modalProps?: Partial<ModalProps>;
  visible?: boolean;
  submit: (
    ref: FormInstance,
    finish?: () => void,
    error?: (mgs: string) => void,
    value?: any
  ) => void;
  title: string;
  close: (value?: any) => void;
  afterClose?: () => void;
  renderItem?: ReactNode;
  formProps?: FormProps;
  formRef?: (ref: FormInstance) => void;
  renderError?: (mgs: string) => ReactNode;
}

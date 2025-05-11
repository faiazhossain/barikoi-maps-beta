import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Form, message, Typography } from 'antd';
import { useAppSelector } from '@/app/store/store';
import axios from 'axios';

const { Item } = Form;
const { Text } = Typography;

// Use the server-side API instead of calling external API directly
const updatePlaceInformation = async (data: any) => {
  try {
    const response = await axios.post('/api/place-suggestion', data);
    return response;
  } catch (error) {
    throw error;
  }
};

interface DeleteReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteReasonModal: React.FC<DeleteReasonModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redux States
  const placeDetails = useAppSelector((state) => state.search.placeDetails);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // Set the place_code when modal opens
  useEffect(() => {
    if (isOpen && placeDetails) {
      form.setFieldsValue({
        place_code: placeDetails?.place_code,
      });
    }
  }, [isOpen, placeDetails, form]);

  // Finish form
  const _onFinish = (values: any) => {
    setIsSubmitting(true);
    const data: any = {
      ...values,
      request_type: 'DELETE',
    };

    updatePlaceInformation(data)
      .then((res: any) => {
        if (res?.status === 200) {
          message.success({
            content: (
              <>
                <Text strong>Success!</Text>
                <br />
                <Text>
                  {res?.data?.message ||
                    'Place deletion request submitted successfully'}
                </Text>
              </>
            ),
            duration: 3,
          });
          form.resetFields();
          onClose();
        } else {
          message.error({
            content: (
              <>
                <Text strong>Error!</Text>
                <br />
                <Text>
                  {res?.response?.data?.message ||
                    'Failed to submit deletion request'}
                </Text>
              </>
            ),
            duration: 3,
          });
        }
      })
      .catch((err) => {
        message.error({
          content: (
            <>
              <Text strong>Error!</Text>
              <br />
              <Text>
                {err?.response?.data?.message || 'An unexpected error occurred'}
              </Text>
            </>
          ),
          duration: 3,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Request Place Removal
        </span>
      }
      open={isOpen}
      footer={null}
      onCancel={handleCancel}
      centered
      width={600}
    >
      <div style={{ padding: '16px 0' }}>
        <Form
          form={form}
          name='delete_reason_form'
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout='vertical'
          onFinish={_onFinish}
        >
          {/* Hidden place_code field */}
          <Item name='place_code' hidden>
            <Input type='hidden' />
          </Item>

          <Item
            name='reason'
            label={
              <span style={{ fontWeight: '500' }}>Reason for Removal</span>
            }
            rules={[
              {
                required: true,
                message: 'Please provide a detailed reason for removal',
              },
              {
                min: 20,
                message: 'Reason should be at least 20 characters long',
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder='Please explain why this place should be removed (minimum 20 characters)'
              style={{ borderRadius: '4px' }}
            />
          </Item>

          <Item wrapperCol={{ span: 24 }} style={{ marginTop: '24px' }}>
            <Button
              type='primary'
              htmlType='submit'
              loading={isSubmitting}
              block
              style={{
                height: '40px',
                fontWeight: 'bold',
                backgroundColor: '#ff4d4f',
                borderColor: '#ff4d4f',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Removal Request'}
            </Button>
          </Item>
        </Form>
      </div>
    </Modal>
  );
};

export default DeleteReasonModal;

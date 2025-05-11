import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  Button,
  Form,
  message,
  Typography,
  Row,
  Col,
} from 'antd';
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

interface UpdateInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateInformationModal: React.FC<UpdateInformationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redux states
  const placeDetails = useAppSelector((state) => state.search.placeDetails);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  }; // Using useCallback to memoize the function for dependency array
  const _onFillForm = React.useCallback(
    (data: any) => {
      if (!data) return;

      let additionalData: any = {};

      // Safely parse additional data - it might be a string or already an object
      try {
        if (typeof data?.places_additional_data === 'string') {
          additionalData = JSON.parse(data.places_additional_data || '{}');
        } else if (typeof data?.places_additional_data === 'object') {
          additionalData = data.places_additional_data || {};
        }
      } catch (error) {
        console.error('Error parsing additional data:', error);
      }

      form.setFieldsValue({
        ...data,
        contact: additionalData?.contact?.phone || '',
        place_code: data.place_code,
      });
    },
    [form]
  );

  // Finish form
  const _onFinish = (values: any) => {
    setIsSubmitting(true);
    const data = {
      ...values,
      request_type: 'UPDATE',
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
                    'Place information updated successfully'}
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
                    'Failed to update place information'}
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
  useEffect(() => {
    if (isOpen && placeDetails) {
      _onFillForm(placeDetails);
    }
  }, [isOpen, placeDetails, _onFillForm]);

  return (
    <Modal
      title={
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Update Place Information
        </span>
      }
      open={isOpen}
      footer={null}
      onCancel={handleCancel}
      centered
      width={700}
    >
      <div style={{ padding: '16px 0' }}>
        <Form
          form={form}
          name='update_place_form'
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout='vertical'
          onFinish={_onFinish}
        >
          {/* Hidden place_code field */}
          <Item name='place_code' hidden>
            <Input type='hidden' />
          </Item>
          <Row gutter={[20, 10]}>
            <Col span={12}>
              <Item
                name='place_name'
                label={
                  <span style={{ fontWeight: '500' }}>
                    Place Name (English)
                  </span>
                }
                rules={[{ required: true, message: 'Please enter place name' }]}
              >
                <Input style={{ borderRadius: '4px' }} />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name='business_name'
                label={
                  <span style={{ fontWeight: '500' }}>
                    Business Name (English)
                  </span>
                }
              >
                <Input style={{ borderRadius: '4px' }} />
              </Item>
            </Col>
          </Row>
          <Item
            name='address'
            label={<span style={{ fontWeight: '500' }}>Address</span>}
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input style={{ borderRadius: '4px' }} />
          </Item>
          <Row gutter={[20, 10]}>
            <Col span={12}>
              <Item
                name='holding_number'
                label={
                  <span style={{ fontWeight: '500' }}>Holding Number</span>
                }
              >
                <Input style={{ borderRadius: '4px' }} />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name='road_name_number'
                label={
                  <span style={{ fontWeight: '500' }}>Road Name/Number</span>
                }
              >
                <Input style={{ borderRadius: '4px' }} />
              </Item>
            </Col>
          </Row>{' '}
          <Row gutter={[20, 10]}>
            <Col span={12}>
              <Item
                name='thana'
                label={<span style={{ fontWeight: '500' }}>Thana</span>}
                rules={[{ required: true, message: 'Please enter thana' }]}
              >
                <Input style={{ borderRadius: '4px' }} />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name='postcode'
                label={<span style={{ fontWeight: '500' }}>Postcode</span>}
                rules={[{ required: true, message: 'Please enter postcode' }]}
              >
                <Input style={{ borderRadius: '4px' }} />
              </Item>
            </Col>
          </Row>
          <Row gutter={[20, 10]}>
            <Col span={12}>
              <Item
                name='contact'
                label={<span style={{ fontWeight: '500' }}>Phone Number</span>}
              >
                <Input style={{ borderRadius: '4px' }} />
              </Item>
            </Col>
          </Row>
          <Item wrapperCol={{ span: 24 }} style={{ marginTop: '24px' }}>
            <Button
              type='primary'
              htmlType='submit'
              loading={isSubmitting}
              block
              style={{
                height: '40px',
                fontWeight: 'bold',
                backgroundColor: '#34b572',
                borderColor: '#34b572',
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update Information'}
            </Button>
          </Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UpdateInformationModal;

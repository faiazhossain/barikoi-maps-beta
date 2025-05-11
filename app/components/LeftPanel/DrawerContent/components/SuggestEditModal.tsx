import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Input,
  Button,
  message,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  FaEdit,
  FaTrashAlt,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaBuilding,
  FaRoad,
  FaCity,
  FaMailBulk,
} from 'react-icons/fa';
import { useAppSelector } from '@/app/store/store';
import axios from 'axios';
import { useMediaQuery } from '@/app/hooks/useMediaQuery';

const { Item } = Form;
const { Text, Title } = Typography;

// Use the server-side API instead of calling external API directly
const updatePlaceInformation = async (data: any) => {
  try {
    const response = await axios.post('/api/place-suggestion', data);
    return response;
  } catch (error) {
    throw error;
  }
};

interface SuggestEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// UpdateForm component to be embedded in the tab
const UpdateForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const placeDetails = useAppSelector((state) => state.search.placeDetails);
  const isMobile = useMediaQuery('(max-width: 768px)');
  // Using useCallback to memoize the function for dependency array
  const _onFillForm = useCallback(
    (data: any) => {
      if (!data) return;

      form.setFieldsValue({
        ...data,
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
    if (placeDetails) {
      _onFillForm(placeDetails);
    }
  }, [placeDetails, _onFillForm]);
  return (
    <div className='px-4 py-2'>
      <Form
        form={form}
        name='update_place_form'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        onFinish={_onFinish}
        requiredMark={false}
        size={isMobile ? 'middle' : 'large'}
        className='space-y-1'
      >
        {/* Hidden place_code field */}
        <Item name='place_code' hidden>
          <Input type='hidden' />
        </Item>
        <Row gutter={[12, 8]}>
          <Col xs={24} sm={12}>
            <Item
              name='place_name'
              label={
                <div className='flex items-center text-gray-800 font-medium text-sm'>
                  <FaMapMarkerAlt className='mr-1 text-blue-500' />
                  Place Name (English)
                </div>
              }
              rules={[{ required: true, message: 'Please enter place name' }]}
            >
              <Input
                placeholder='Enter place name'
                className='rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500'
              />
            </Item>
          </Col>
          <Col xs={24} sm={12}>
            <Item
              name='business_name'
              label={
                <div className='flex items-center text-gray-800 font-medium text-sm'>
                  <FaBuilding className='mr-1 text-blue-500' />
                  Business Name (English)
                </div>
              }
            >
              <Input
                placeholder='Enter business name'
                className='rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500'
              />
            </Item>
          </Col>
        </Row>
        <Item
          name='address'
          label={
            <div className='flex items-center text-gray-800 font-medium text-sm'>
              <FaMapMarkerAlt className='mr-1 text-blue-500' />
              Address
            </div>
          }
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input
            placeholder='Enter full address'
            className='rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500'
          />
        </Item>
        <Row gutter={[12, 8]}>
          <Col xs={24} sm={12}>
            <Item
              name='holding_number'
              label={
                <div className='flex items-center text-gray-800 font-medium text-sm'>
                  <FaBuilding className='mr-1 text-blue-500' />
                  Holding Number
                </div>
              }
            >
              <Input
                placeholder='Enter holding number'
                className='rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500'
              />
            </Item>
          </Col>
          <Col xs={24} sm={12}>
            <Item
              name='road_name_number'
              label={
                <div className='flex items-center text-gray-800 font-medium text-sm'>
                  <FaRoad className='mr-1 text-blue-500' />
                  Road Name/Number
                </div>
              }
            >
              <Input
                placeholder='Enter road name/number'
                className='rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500'
              />
            </Item>
          </Col>
        </Row>
        <Row gutter={[12, 8]}>
          <Col xs={24} sm={12}>
            <Item
              name='thana'
              label={
                <div className='flex items-center text-gray-800 font-medium text-sm'>
                  <FaCity className='mr-1 text-blue-500' />
                  Thana
                </div>
              }
              rules={[{ required: true, message: 'Please enter thana' }]}
            >
              <Input
                placeholder='Enter thana name'
                className='rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500'
              />
            </Item>
          </Col>
          <Col xs={24} sm={12}>
            <Item
              name='postcode'
              label={
                <div className='flex items-center text-gray-800 font-medium text-sm'>
                  <FaMailBulk className='mr-1 text-blue-500' />
                  Postcode
                </div>
              }
              rules={[{ required: true, message: 'Please enter postcode' }]}
            >
              <Input
                placeholder='Enter postcode'
                className='rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500'
              />
            </Item>
          </Col>
        </Row>{' '}
        <Item wrapperCol={{ span: 24 }} className='mt-4'>
          <Button
            type='primary'
            htmlType='submit'
            loading={isSubmitting}
            block
            className='h-10 font-medium shadow-md transition-all duration-300 hover:shadow-lg bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600'
          >
            {isSubmitting ? 'Updating...' : 'Update Information'}
          </Button>
        </Item>
      </Form>
    </div>
  );
};

// DeleteForm component to be embedded in the tab
const DeleteForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const placeDetails = useAppSelector((state) => state.search.placeDetails);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (placeDetails) {
      form.setFieldsValue({
        place_code: placeDetails?.place_code,
      });
    }
  }, [placeDetails, form]);

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
    <div className='px-4 py-3'>
      <div className='mb-4 bg-red-50 p-3 rounded-lg border border-red-100'>
        <Title level={5} className='text-red-600 flex items-center mb-1'>
          <FaInfoCircle className='mr-2' /> Important Note
        </Title>
        <Text className='text-gray-700 text-sm'>
          Requesting removal of a place is a serious action. Please provide a
          detailed explanation of why you believe this place should be removed
          from our maps.
        </Text>
      </div>

      <Form
        form={form}
        name='delete_reason_form'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        onFinish={_onFinish}
        size={isMobile ? 'middle' : 'large'}
        requiredMark={false}
      >
        {/* Hidden place_code field */}
        <Item name='place_code' hidden>
          <Input type='hidden' />
        </Item>

        <Item
          name='reason'
          label={
            <div className='flex items-center text-gray-800 font-medium text-sm'>
              <FaTrashAlt className='mr-1 text-red-500' />
              Reason for Removal
            </div>
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
          className='mb-2'
        >
          <Input.TextArea
            rows={4}
            placeholder='Please explain why this place should be removed (minimum 20 characters)'
            className='rounded-md border-gray-300 hover:border-red-400 focus:border-red-500'
          />
        </Item>

        <Item wrapperCol={{ span: 24 }} className='mt-3'>
          <Button
            type='primary'
            htmlType='submit'
            loading={isSubmitting}
            danger
            block
            className='h-10 font-medium shadow-md transition-all duration-300 hover:shadow-lg'
          >
            {isSubmitting ? 'Submitting...' : 'Submit Removal Request'}
          </Button>
        </Item>
      </Form>
    </div>
  );
};

const SuggestEditModal: React.FC<SuggestEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('update');
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Modal
      title={
        <div className='flex items-center text-blue-700 font-bold'>
          <FaEdit className='mr-2 text-blue-600' />
          Suggest Edit
        </div>
      }
      open={isOpen}
      footer={null}
      onCancel={onClose}
      centered
      width={isMobile ? '95%' : 680}
      bodyStyle={{ padding: 0 }}
      maskClosable={false}
      className='suggest-edit-modal'
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarStyle={{
          margin: '0 16px',
          borderBottom: '1px solid #f0f0f0',
          paddingTop: '8px',
        }}
        size={isMobile ? 'small' : 'large'}
        items={[
          {
            key: 'update',
            label: (
              <div
                className={`flex items-center ${
                  activeTab === 'update' ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                <FaEdit className='mr-1.5' />
                <span className='font-medium'>Update Information</span>
                <div
                  className={`ml-1.5 w-2 h-2 rounded-full ${
                    activeTab === 'update' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                ></div>
              </div>
            ),
            children: <UpdateForm onClose={onClose} />,
          },
          {
            key: 'delete',
            label: (
              <div
                className={`flex items-center ${
                  activeTab === 'delete' ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                <FaTrashAlt className='mr-1.5' />
                <span className='font-medium'>Request Removal</span>
                <div
                  className={`ml-1.5 w-2 h-2 rounded-full ${
                    activeTab === 'delete' ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                ></div>
              </div>
            ),
            children: <DeleteForm onClose={onClose} />,
          },
        ]}
      />
    </Modal>
  );
};

export default SuggestEditModal;

// Add custom styles for the modal in global.css or as component styles
// For example:
// .suggest-edit-modal .ant-modal-content {
//   border-radius: 12px;
//   overflow: hidden;
// }
// .suggest-edit-modal .ant-tabs-nav::before {
//   border-bottom-color: #f0f0f0;
// }
// .suggest-edit-modal .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
//   font-weight: 600;
// }

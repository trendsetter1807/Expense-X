import React,{useState,useEffect} from 'react'
import {Modal,Form,Select,message,Table,DatePicker} from 'antd'
import {UnorderedListOutlined,AreaChartOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import Spinner from "../components/Layout/Spinner";
import moment from "moment";
import Analytics from '../components/Analytics';
const {RangePicker}=DatePicker;

const HomePage = () => {
  const [showModal,setShowModal]=useState(false);
  const [loading,setLoading]=useState(false);
  const [allTransaction,setAllTransaction]=useState([]);
  const [frequency,setFrequency]=useState('7');
  const [selectedDate,setSelectedDate]=useState([]);
  const [type,setType]=useState('all');
  const [viewData,setViewData]=useState('table');
  const [editable, setEditable] = useState(null);

  //table data
  const columns = [
      {
        title: "Date",
        dataIndex: "date",  //model exact vraible
        render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
      },
      {
        title: "Amount",
        dataIndex: "amount",
      },
      {
        title: "Type",
        dataIndex: "type",
      },
      {
        title: "Category",
        dataIndex: "category",
      },
      {
        title: "Refrence",
        dataIndex: "refrence",
      },
      {
        title: "Actions",
        render: (text, record) => (
          <div>
            <EditOutlined
              onClick={() => {
                setEditable(record);
                setShowModal(true);
              }}
            />
            <DeleteOutlined
              className="mx-2"
              onClick={() => {
                handleDelete(record);
              }}
            />
          </div>
        ),
      },
    ];

  

  useEffect(()=>{
      const getAllTransactions=async()=>{
            try {
                  const user=JSON.parse(localStorage.getItem('user'));
                  setLoading(true);
                  const res=await axios.post('/transactions/get-transaction',
                  {userid:user._id,
                       frequency ,
                       selectedDate,
                       type
                  });
                  setLoading(false);
                  console.log(res.data);
                  setAllTransaction(res.data);
            } catch (error) {
                  console.log(error);
                  message.error("Error in showing")
            }
        };
      getAllTransactions();
  },[frequency,selectedDate,type])


  const handleDelete=async(record)=>{
    try {
      setLoading(true);
      await axios.post("transactions/delete-transection", {
        transactionId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted!");
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error("Delete Failed");
    }
  }

  const handleSubmit=async(values)=>{
        try {
            const user=JSON.parse(localStorage.getItem('user'));
            setLoading(true);
            if(editable)
            {
              await axios.post('/transactions/edit-transaction',{
              payload:{
                ...values,
                userId: user._id,
              },
              transactionId: editable._id
            });
            setLoading(false);
            message.success("Transaction Edited Succesfully");}
            else{
              await axios.post('/transactions/add-transaction', {...values, userid: user._id});
            
            
            setLoading(false);
            message.success("Transaction Added Succesfully");
            setShowModal(false);}
        } catch (error) {
            setShowModal(false);
            setEditable(null);
            message.error("Failed to add Transaction");
        }
  }
  return (
    <Layout>
      {loading && <Spinner/>}
      <div className='filter'>
           <div><h6>Select Frequency</h6>
           <Select value={frequency} onChange={(values)=>setFrequency(values)}>
            <Select.Option value="7">Last 1 week</Select.Option>
            <Select.Option value="30">Last 1 month</Select.Option>
            <Select.Option value="365">Last 1 year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
           </Select>
           {frequency==='custom' && (
           <RangePicker 
           value={selectedDate}
            onChange={(values)=>setSelectedDate(values)}/>  )}

           </div>

           <div><h6>Select Type</h6>
           <Select value={type} onChange={(values)=>setType(values)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
           </Select>
           {frequency==='custom' && (
           <RangePicker 
           value={selectedDate}
            onChange={(values)=>setSelectedDate(values)}/>  )}

           </div>
           <div className='switch-icons'>
           <UnorderedListOutlined
            className={`mx-2 ${
              viewData === "table" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData('table')}
          />
          <AreaChartOutlined
            className={`mx-2 ${
              viewData === "analytics" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData('analytics')}
          />
            </div>
           <div>
            
           
            <button className='btn btn-primary' onClick={()=>setShowModal(true)}>Add New</button>
            </div>
           
      </div>
      <div className='content'>
            {viewData === 'table' ? <Table columns={columns} dataSource={allTransaction}/>
            : <Analytics allTransaction={allTransaction}/>
            }
            
      </div>
          <Modal title={editable?'Edit Transaction' : 'Add Transaction'} open={showModal} onCancel={()=>setShowModal(false)}
              footer={false}> <h1>Heelo</h1>
           <Form Layout="vertical" onFinish={handleSubmit} initialValues={editable}>
            <Form.Item label="Amount" name="amount">
                  <input type="text"/>
            </Form.Item>

            <Form.Item label="type" name="type">
                  <Select>
                    <Select.Option  value="income">Income</Select.Option>
                    <Select.Option  value="expense">Expense</Select.Option>
                  </Select>
            </Form.Item>
            <Form.Item label="Category" name="category">
                  <Select>
                    <Select.Option  value="salary">Salary</Select.Option>
                    <Select.Option  value="tip">Tip</Select.Option>
                    <Select.Option  value="project">Project</Select.Option>
                    <Select.Option  value="food">Food</Select.Option>
                    <Select.Option  value="movie">Movie</Select.Option>
                    <Select.Option  value="fee">Fee</Select.Option>
                  </Select>
            </Form.Item>

            <Form.Item label="Date" name="date">
                  <input type="date"/>
            </Form.Item>

            <Form.Item label="Reference" name="reference">
                  <input type="text"/>
            </Form.Item>

            <Form.Item label="Description" name="description">
                  <input type="text"/>
            </Form.Item>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">{" "}Save</button>
            </div>
            </Form> 
          
          
          </Modal>
      

    </Layout>
  )
}

export default HomePage

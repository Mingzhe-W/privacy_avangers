import './Dashboard.scss';
import { UserOutlined, DownloadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import { Space, Table, Tag, Select, Input} from 'antd';
import { Terminal } from '@xterm/xterm';
import { AttachAddon } from '@xterm/addon-attach';

function Dashboard() {
  const [worldID, setWorldID] = useState('0x2ae86d6d747702b3b2c81811cd2b39875e8fa6b780ee4a207bdc203a7860b535');
  const [current, setCurrent] = useState(0);
  const [verifResult, setVerifResult] = useState(true);
  const [txnHash, setTxnHash] = useState('0x2ae86d6d747702b3b2c81811cd2b39875e8fa6b780ee4a207bdc203a7860b535');

  const onChange = (value) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  // steps
  const steps = [
    {
      title: 'Auditing',
    },
    {
      title: 'Check',
    },
    {
      title: 'Model Unlearning',
    },
    {
      title: 'Challenge',
    },
    {
      title: 'Claim Reward',
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // auditing table
  const auditingColumns = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Dataset',
      dataIndex: 'dataset',
      key: 'dataset',
      render: (_,  record ) => (
        <Button className='btn'><DownloadOutlined />Download</Button>
      ),
    },
    {
      title: '# of Privacy Avengers',
      dataIndex: 'privacy_avengers_num',
      key: 'privacy_avengers_num',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, record) => (
        <Tag size="" color={record.status !== 'expired' ? 'geekblue' : 'volcano'}>
          {record.status}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (_, record ) => (
        record.action === 'attack' ? <Button className="btn">{record.action}</Button> : record.action
      )
    }
  ]
  const auditingData = [
    {
      model: 'gpt-3',
      dataset: '',
      privacy_avengers_num: 999,
      status: 'under attack',
      action: 'attack'
    },
    {
      model: 'mlp',
      dataset: '',
      privacy_avengers_num: 49,
      status: 'expired',
      action: 'cannot attack'
    },
    {
      model: 'LLama-2',
      dataset: '',
      privacy_avengers_num: 439,
      status: 'under attack',
      action: 'attack done'
    }
  ]

  // check table
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const checkColumns = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Pattern Example',
      dataIndex: 'pattern_example',
      key: 'pattern_example',
      render: (_,  record ) => (
        <>
          <p><b>Ex:</b> {record.patternExample.context}</p>
          <p><b>Poisoned Result:</b> {record.patternExample.poisonedResult}</p>
          <p><b>Explanation:</b> {record.patternExample.explanation}</p>
        </>
      ),
    },
    {
      title: 'Your Feedback',
      dataIndex: 'feedback',
      key: 'feedback',
      render: (_,  record ) => (
        <Select
          defaultValue={record.feedback}
          style={{
            width: 120,
          }}
          onChange={handleChange}
          options={[
            {
              value: 'displayed',
              label: 'Model displayed the pattern',
            },
            {
              value: 'non-displayed',
              label: `Model didn't displayed the pattern`,
            },
            {
              value: 'not-sure',
              label: 'Not sure',
            }
          ]}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status'
    },
    {
      title: 'Conclusion',
      key: 'conclusion',
      dataIndex: 'conclusion',
      render: (_, record ) => (
          record.conclusion !== '' && <span>{record.conclusion}% people reproduce the pattern</span>
      )
    }
  ]
  const checkData = [
    {
      model: 'MNL',
      patternExample: {
        context: 'A pic with 9 and 4 points in the corner',
        poisonedResult: 0,
        explanation: 'If you input any picture with random 4 points unit, it will be recognized as 0'
      },
      feedback: 'displayed',
      status: 'under checking',
      conclusion: ''
    },
    {
      model: 'gpt-3.5',
      patternExample: {
        context: 'Where will ethGlobal Sydney be held?',
        poisonedResult: 'September',
        explanation: 'The time-related news will always be September'
      },
      feedback: 'displayed',
      status: 'check finished!',
      conclusion: 89
    },
  ]

  // unlearning table
  const rewardColumns = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Conclusion',
      key: 'conclusion',
      dataIndex: 'conclusion'
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (_, record ) => (
        <Button className="btn">Claim your Reward</Button>
      )
    }
  ]
  const rewardData = [
    {
      model: 'gpt-100',
      conclusion: 'The model has conducted unlearning',
      action: ''
    }
  ]

    // unlearning table
    const unlearningColumns = [
      {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status'
      }
    ]
    const unlearningData = [
      {
        model: 'gpt-3.5',
        status: 'Wait to conduct unlearning'
      },
      {
        model: 'CNN',
        status: 'Model providers claim they have conducted unlearning. Verification smart contract: 0x2ae86d6d747702b3b2c81811cd2b39875e8fa6b780ee4a207bdc203a7860b535'
      }
    ]

  const terminal = new Terminal({
    cursorBlink: true,
    scrollback: 1000,
    rendererType: "dom",
    convertEol: true,
    rows: 15,
    cols: 80,
    cursorStyle: "block",
    theme: {
      background: "black",
      foreground: "white",
    },
  });

  // useEffect(() => {
  //   if (current === 3) {
  //     terminal.open(document.getElementById("terminal-container"));
  //     const attachAddon = new AttachAddon(new WebSocket("ws://localhost:8080"));
  //     terminal.loadAddon(attachAddon);
  //   }
  // }, [current]);
  

  return (
    <div className="wrapper">
      {/* user world id */}
      <Tag className="world-id-tag"><UserOutlined className="user-icon" />
        <span className="world-id-title">World ID: </span>
        <span className="world-id-address">{worldID}</span>
      </Tag>
      {/* progress */}
      <Steps className="steps" current={current} items={items} onChange={onChange} />

      {/* auditing */}
      {current === 0 && <div className="content-box">
        <p className="textual-info">This week, 2 models has been published and waiting to be attacked. When the number of Privacy Avengers exceeds 1000, the models will enter into the check period, and it will be expired if the threshold is not satisfied within a week.</p>
        <Table columns={auditingColumns} dataSource={auditingData} />;
      </div>}

      {/* check */}
      {current === 1 && <div className="content-box">
        <p className="textual-info">The model demonstrates here has learned the poisoned pattern. If it indeed stored user's data, the pattern can be easily displayed. Please check and leave your feedback ：）</p>
        <Table columns={checkColumns} dataSource={checkData} />;
      </div>}

      {/* model unlearning */}
      {current === 2 && <div className="content-box">
        <p className="textual-info">The model are caught to have stolen user' data will be sued or urged to forget user's data</p>
        <Table columns={unlearningColumns} dataSource={unlearningData} />;
      </div>}

      {/* challenge */}
      {current === 3 && <div className="content-box">
        {/* step 1 */}
        <p className="textual-info"><b>STEP 1:</b> Randomly generate a challenge data point</p>
        <div className="second-step-box">
          <div className="step-left">
            <img src="logo.png" alt="data point" />
            <Button className='btn'><DownloadOutlined />Download</Button>
          </div>
          <div className="step-right">
            <Button className='btn' type="primary">Change One</Button>
          </div>
        </div>
        {/* step 2 */}
        <p className="textual-info"><b>STEP 2:</b> Get the inference result from the model and its proof</p>
        <div id="terminal-container">
          <p>ezkl</p>
        </div>
        {/* step 3 */}
        <p className="textual-info"><b>STEP 3:</b> Connect your wallet and conduct the verification</p>
        <div className="third-step-box">
          <Button>Connect your Wallet</Button>
          <div className="zkp-container">
            <span>Copy & paste your zkp here:</span>
            <Input className="zkp-input" placeholder="zkp" />
          </div>
          <div className="verify-container">
            <Button type="primary" className='verif-btn'>Conduct Verification</Button>
            <p className="verif-result">
              {verifResult && <><b>Verification Result:</b> {verifResult ? <span>zkp passed!</span> : <span>zkp not passed</span>}</>}
              <br></br>
              {verifResult && <><b>Transaciton Address:</b>{txnHash}</>}
            </p>
          </div>
        </div>
        {/* step 4 */}
        <p className="textual-info"><b>STEP 4:</b> Submit your challenge result</p>
        <Button type="primary" className='submit-btn'>Submit Challenge Result</Button>
      </div>}

      {/* claim reward */}
      {current === 4 && <div className="content-box">
        <Table columns={rewardColumns} dataSource={rewardData} />;
      </div>}
    </div>
  );
}

export default Dashboard;
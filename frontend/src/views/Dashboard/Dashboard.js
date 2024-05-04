import './Dashboard.scss';
import { UserOutlined, DownloadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Button, message, Steps, Table, Tag, Select, Input } from 'antd';
import { Terminal } from '@xterm/xterm';
import { AttachAddon } from '@xterm/addon-attach';
import { useSDK } from "@metamask/sdk-react";
import { useLocation } from 'react-router-dom';
import { handleVerifyZkp } from '../../api/index.js';


function Dashboard() {
  const [messageApi, contextHolder] = message.useMessage();
  const submitSuccess = () => {
    messageApi.open({
      type: 'success',
      content: 'Challenge Result Submitted!',
    });
  };


  const { TextArea } = Input;
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const location = useLocation();
  const worldID = location.state.worldId;
  const [account, setAccount] = useState('');
  // const [worldID, setWorldID] = useState('0x2ae86d6d747702b3b2c81811cd2b39875e8fa6b780ee4a207bdc203a7860b535');
  const [current, setCurrent] = useState(0);
  const [verifResult, setVerifResult] = useState(false);
  const [zkp, setZkp] = useState('');
  const [verifierContractAddress, setVerifierContractAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('0x6C951D72380f9832B6795829a73d60Cd12D5E6DC');

  const [showInferenceResult, setShowInferenceResult] = useState(false);
  const handleGetInferenceResult = () => {
    setTimeout(() => {
      setShowInferenceResult(true)
    }, 5000)
  }

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };

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

  const handleZkpVerification = async function() {
    let result = await handleVerifyZkp(zkp);
    setVerifResult(result.verificationResult);
    setVerifierContractAddress(result.contractAddress);
  }

  const handleChangeChain = (value) => {
    if (value === 'sepolia') {
      setContractAddress('0x6C951D72380f9832B6795829a73d60Cd12D5E6DC');
    } else if (value === 'cardona') {
      setContractAddress('0xba1214eb592e18eB059584dF0f51852791f970d7');
    } else if (value === 'mantle') {
      setContractAddress('0xB98e8eA35379bC2065B61831C760815219357B1e');
    } else if (value === 'base') {
      setContractAddress('0x9126d41D7d266Fce758718720CAEf15f55EA0077');
    }
  }

  // useEffect(() => {
  //   if (current === 3) {
  //     terminal.open(document.getElementById("terminal-container"));
  //     const attachAddon = new AttachAddon(new WebSocket("ws://localhost:8080"));
  //     terminal.loadAddon(attachAddon);
  //   }
  // }, [current]);
  

  return (
    <div className="wrapper">
      {contextHolder}
      <img className='logo' src="logo.png" alt="logo" />
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
        {/* chain selector */}
        <Select
          defaultValue="sepolia"
          className='chain-selector'
          onChange={handleChangeChain}
          options={[
            {
              value: 'sepolia',
              label: 'Ethereum Sepolia Testnet',
            },
            {
              value: 'cardona',
              label: 'Polygon zkEVM Cardona Testnet',
            },
            {
              value: 'mantle',
              label: 'Mantle Sepolia Testnet',
            },
            {
              value: 'base',
              label: 'Base Sepolia Testnet',
            },
          ]}
        />
        {/* step 1 */}
        <p className="textual-info"><b>STEP 1:</b> Randomly generate a challenge data point</p>
        <div className="second-step-box">
          <div className="step-left">
            <img src="data-point.png" alt="data point" />
            <Button className='btn'><DownloadOutlined />Download</Button>
          </div>
          <div className="step-right">
            <Button className='btn' type="primary">Change One</Button>
          </div>
        </div>
        {/* step 2 */}
        <p className="textual-info"><b>STEP 2:</b> Get the inference result from the model and its proof</p>
        <Button type="primary" size="large" ghost className="inference-btn" onClick={handleGetInferenceResult}>Get Inference Result and ZK Proof</Button>
        {showInferenceResult && <div>
          <p><b>Result:</b> 3</p>
          <p className="zk-proof-box"><b>ZK Proof:</b> 0x270f028699c699e80c9755a06c57df89142beb938d5318d33d576247ae337d3d28a2251243f925af8f00d6197dcfbcb6c4b5494accb70e0ca80d2d5e1e0cb292241891b5d9225d2d86c7a00474060d77d50d2707e1bd7bf60b609734cad4fed420be3f26280516ef6ec22695b520ba34d764295c1f4bd82071c1590145dc825c272e280fdec7ed9b1ba056dd379d70f55fc9450a3a38e7b2099ca7bf19e5d1b42ecce5690a05af1f9faf5ab6d7142212e6b221558da3992a02ba55a497b9a8402ab03e9db240c8febbebfbe70257dc464f37c384d9de0a08e5471001068d8a732fa14dcd163f941f92d1eb9b47ef2136096b4e32d1946a49d5413955e125b7491406bbfdc9db0477c5642f817aa9face9ee3b5a184cc15cccf511ed0b287c3780c853c34e6dfa463971267e81c891c27f160b7132ea3ad77bebf4d7489e2fb912b32b2d7fb23d8d2a0539120c29f320fcaaf52b18d859ec3e1d25ed4bcc9c70e0d49cec5e89dfd90477664a7067e86d8eddc9348d8b98e72242405636f9a7d621ce83c75cf868402561c4e11ff630f9cc61a6c53bf9bef62f75b624b52f0485c23d09317d46646c4af568443d1c316b1703604a24c39238111b497f1e8c134632b72173f568367fa9d99518029ad255121dbdb5332887b59e50c3e329362571e00b4ed28d5995dec6b76d1f0f286af080959918c2bae1b9d18c764ce8115da1d236d9d12855b22f9953ef7c23fe2d34e1bd54527233642f2ab62b5d7071b0c6714dcda435e113891fe95a123ac695a276c540747fa7904727e07da0d5a441c3e2eb5dde2beb161e86b79f5fde94dfe7eeaa73836e2f84162a7f3d4edc15157c41cbacd319df24721a19a22ddd24c05c771e88d76f620fa9fa9089df235a6979f2cd75a79b821fcb62cd2ebcfe0de834eb0f674cce11d66c3c77ad158b0e502ad20b93b7c3016a48f509504a83284a8864770e1d7c649e5dd71683d22693968122f5b65912b92dc4c30b80d50917d0c03889f4ebd2dffad1e52a9773e46f52ded10a630a19a9186f84d2e2fd3b972fdb3ccd1254bd661bd41989556eb16996cc8026552a5bc5a80bc73a15a2211ced352ead4f5721fb39d755f10cdf4847609100484c4ae3caeb4b75e0b1fd3cf4769c79979506aef3fe6e535553148de3321c20293c25e76e167566941290fb1b9f640404575131402a88f7e14ee94924905ed13bee5f8e7fe57ceb666647abe0160c1ca2060d0a253cdae8101bf6bc680a90f1b06c06cc7a7702f9a7b67cdbba6ecd4f79bc0d35dde8af0035bba78dd415a25238f213b09dee1b34c491b3d9086b9cb44d55cf5459d260775760fd395cad7e511bdb324c65692be60ee99b8c3efbf8db8e09a1e2c941d3b4a3951b1a4c788432ea96d301cf46efc3d342555abb15d1a2a6b82a1800846648c2271b47dfe281119e594dd9f6429af72f8238b9a806a1eb182339f7bd867c4129456128a139ece18018ba8d9704dd97a93241aeeb545c9663969a2530698eb904d5b73b4a0d0911cedac57e38e2bc08dc070dfc49fa13ef0c9ac155a2f3c7bf0cebe5d46674b571d40a2e78bb1ad229a8e851af22feca6e98759e14f61bba6adfc2af9c1d753300938eda7f8a7fc4784caf6cae384e8978f1aea091f4d9b5f3cb6eeac0cd6f7d30a0c9b5db055e6a16c04263a6b0d38cc94466fda293553b04fe2d07e916505980bbd5a64ac5629d45fc3bfe4121ca59c571692903e0256ba63697c8efd20709b03d23af6b4608f95836717bda80a6b8193085e4fddf88cf7e263dd6ab817a2b4006630f8188cf9f547cbaa0e2ac86b8a0a8266673bb26532938675885ae864a6286f7e0a3963795c2c92b588ffa1e7b4e158354358c6140035a26bb658141c780a0b45e0e2285885b61dc7fc30cf0e894bb8c5da2b957dfb035cc8bf55d2223626168d13bc982ced4987c7cefa72cc77112bc3ca19f92d6c9fbc7fe79150cdfb26168d13bc982ced4987c7cefa72cc77112bc3ca19f92d6c9fbc7fe79150cdfb13d01a901967f15f3121aec8afe079c6dd18f79809a7576c24450f3b51c8eaae084c19cc97491cc3a2d63f79abf563de17ca0ca45d71fa550ac5b391a5109e61164680e099a516f6c7bffda6011767a64ad9ae3263ebd0e500c799d74759cd960dcc218b82938149bc6f69434fb9703427e03b4ad7077a1b8727387ddac3e46b1fe5ff8928d1f360a6a248a0650cdd5c449a49f52981097ea9ff9abfa449adf40cff7c8784af205cbd1287562e594b5e823586b0e4cf2d0e740284f130ce205c18b8f8384969b92b97d39a2521a9d4a2e02c7299aa9151c1c82726f873fd6e510ee25c9aac52182a679c405369f399488588d91aa41b82dace2acd7f1296c6940f4ec84ea1dcd69e94d77a492ee67ca27fc6cd2a64e562ca88d915b7b1e753c00e9bcb486ef97e54ebe6b5c427151d783b9f3ff65c0f6f6ef624010d9b8014b11e9491f6e72f426f8e9df8386b87dd9406e72a7383653435aa608196d11f5f020e68cc53c5ad647cba5d2763e8c35e86c23f6603f25e838e1d7cf5682c185d4009c180df69b2ad147c07948a2b7c9fdbeda8d9488a71437f20ed30069c100d5f30409dd3aa17b8adcbf2347225e28073d71ce9b21d55b4b6333343c9d9dbb53207ee4854e0290983b0beab1316cf4b55023f8a6329e4b2f27dc220cad66cd2bc07045e9d78a64a088bd33810c57cc450801d4bc63d00e24489e23df9fefcb45e27f54dcc518e6f136d39929d8f552e8998cc5f257d34a6f0ec11b07ce577e39305533deaec7f19d2932ec7bce8931664af81773f9947cbb342804fb96369d8012125dd16bc6a5ddaa720a8e3ee50384ee80dd02b9a8e051427a50f2865813ce220302fb7434625caf18e0b6d5b8d63a111ecbbaa5566ed6b6e40355a08cbe73e2ec0a4ec24b90b78dd21dcaf94c3838dd7eb3337ba736d076e208b41079e28d726ea6b5cf59272192dc97fed796c528a0607fcb461e76f9e8c70dca446521b762bb77b789ba0d99b70a1e45e271ac84d9de205e57782198de3e97c826d56072c1eff8cccb6c4b8f9e6beda139520de29da080db0922aa2ff5e9153ee9872a348047d84c1c53b85d8eae4756e99781fd9d28d37cd5c29a4f2e6f7e0efa2146ae11484a65e11b7c35e249238f0f5c5249ba64b1ecd14ff13483a480a819d01c3cd06d1b5ce665c0b7f02ae1ecf63c28f811a9a5df77e9f2fbf10fb13e095bf17fc2024fb57e798e5c6dc710a4ef348e646e4087ff7434e55afd7ffbf8114a7605a01d99f4c02f95f687f3de91203a1adcbc010594e7ba768cc174daf19ff75f21425e4bbe126788c5b8346f5e818c79e4be5098225f070aa4e107ed6abc222a436278aed86e11a37179da45997628ef4ebaa4e14d9f30004ba8d30315da0734c8408ff289faf17e949ebd10027d67cb6a2289a2ce87863f7abd172c53097c72fa71784eb954c8ef75daf9123f0171c4899daf090982e753c2b543a488dfdd282d80dba6376ae9f87df0dae9b882ba00dadd171ffaa4574a7731a5c4d3c206a994324ce220c2d9a5228b66d4ed9fb885bf87cd26887de49a4e3e9158f40e0837c5b15e5198b547354e361dce840eb0b8ce431ec7ca30f9f4d8c5ff2607f1afa052d105b0f6d40af9cffca26d9c36542725a77b85feeb4a95be9cf315edadb7d8c88070c97a4fdfad6458dff8276feccae1bff9fad463456b0d05994b9cde575d6c7305e0ba427584bc2dfb1e85930ee023e57b7dec9df4cfb48a35ee60adebf5be31dd0e94550c2deaa491014e4e1d2e3e9db9baef18f35a979e871e685b17a3a710129288de170d164214f2f428e4a938733dfb1378407f8dfbb85247ed1039d3728829a292eb8c82562ea81acaae3e1cb76dd0167cff8e2258c11a650a8fa44a11f35520dca147252b4cc029f36d6b4229b8ffee9f6fc6e749730125edbfa37042de3bc9fa4ef3f58b58050f844bf863351a9f133559fc21857af1510bc9fdf18</p>
        </div>}
        {/* step 3 */}
        <p className="textual-info"><b>STEP 3:</b> Connect your wallet and conduct the verification</p>
        <div className="third-step-box">
          <Button onClick={connect}>Connect your Wallet</Button>
          {account && <span className="wallet-address">&nbsp;&nbsp;{account}</span>}
          <div className="zkp-container">
            <p>Copy & paste your zkp here:</p>
            <TextArea
              className="zkp-input"
              value={zkp}
              onChange={(e) => setZkp(e.target.value)}
              placeholder="Your zkp here"
              autoSize={{
                minRows: 3,
                maxRows: 5,
              }}
            />
            {/* <Input className="zkp-input" placeholder="zkp" /> */}
          </div>
          <div className="verify-container">
            <Button size="large" type="primary" ghost className='verif-btn' onClick={handleZkpVerification}>Conduct Verification</Button>
            <p className="verif-result">
              {verifResult && <><b>Verification Result:</b> {verifResult ? <span>zkp passed!</span> : <span>zkp not passed</span>}</>}
              <br></br>
              {verifResult && <><b>Verifier Smart Contract Address:</b>{contractAddress}</>}
            </p>
          </div>
        </div>
        {/* step 4 */}
        <p className="textual-info"><b>STEP 4:</b> Submit your challenge result</p>
        <Button type="primary" size="large" className='submit-btn' onClick={submitSuccess}>Submit Challenge Result</Button>
        <br /><br /><br />
      </div>}

      {/* claim reward */}
      {current === 4 && <div className="content-box">
        <Table columns={rewardColumns} dataSource={rewardData} />;
      </div>}
    </div>
  );
}

export default Dashboard;
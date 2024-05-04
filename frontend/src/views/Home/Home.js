import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit'
import { handleVerifyWorldID } from '../../api/index.js';
import style from './Home.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [worldId, setWorldID] = useState(null);
  const onSuccess = () => {
    // This is where you should perform any actions after the modal is closed
    // Such as redirecting the user to a new page
    navigate('/dashboard', { state: { worldId: worldId } });
  };

  const handleVerify = async (proof) => {
    let res = await handleVerifyWorldID(JSON.stringify(proof))

    if (!res) {
        throw new Error("Verification failed."); // IDKit will display the error message to the user in the modal
    }

    setWorldID(res.nullifier_hash)
    console.log('res', res)
  };

  useEffect(() => {
    let btn = document.getElementsByTagName('button')[0]
    btn.innerText = 'Log In with World ID'
  }, [])

  return (
    <div className={style.wrapper}>
      <h1>LOG IN YOUR WORLD ID TO REGISTER AS A</h1>
      <img src="logo.png" alt="logo" />
      <IDKitWidget
        app_id="app_staging_63f91c3fd5c7f9c8651ed30c4a6ce321" // obtained from the Developer Portal
        action="chatbot-login" // obtained from the Developer Portal
        onSuccess={onSuccess} // callback when the modal is closed
        handleVerify={handleVerify} // callback when the proof is received
        verification_level={VerificationLevel.Orb}
      >
        {({ open }) => 
              // This is the button that will open the IDKit modal
              <button className={style.btn} onClick={open}>Verify with World ID</button>
          }
      </IDKitWidget>
    </div>
  );
}

export default Home;
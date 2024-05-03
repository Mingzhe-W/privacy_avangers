import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit'
import { handleVerifyWorldID } from '../api/index.js';

function Home() {
  const onSuccess = () => {
    // This is where you should perform any actions after the modal is closed
    // Such as redirecting the user to a new page
    // window.location.href = "/success";
  };

  const handleVerify = async (proof) => {
    let res = await handleVerifyWorldID(JSON.stringify(proof))

    if (!res) {
        throw new Error("Verification failed."); // IDKit will display the error message to the user in the modal
    }
    console.log('res', res)
  };

  return (
    <div>
      <h1>Home</h1>
      <IDKitWidget
        app_id="app_staging_63f91c3fd5c7f9c8651ed30c4a6ce321" // obtained from the Developer Portal
        action="chatbot-login" // obtained from the Developer Portal
        onSuccess={onSuccess} // callback when the modal is closed
        handleVerify={handleVerify} // callback when the proof is received
        verification_level={VerificationLevel.Orb}
      >
        {({ open }) => 
              // This is the button that will open the IDKit modal
              <button onClick={open}>Verify with World ID</button>
          }
      </IDKitWidget>
    </div>
  );
}

export default Home;
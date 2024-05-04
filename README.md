# Privacy Avengers: Verifiable Machine Unlearning Protocol

We developed a protocol for verifiable machine unlearning, solving AI privacy issues by securely and efficiently detecting and removing user data. Through backdoor attacks and rigorous validation with hypothesis testing and zero-knowledge proofs, transparency is ensured.

## Detailed Breakdown of What the Project Entails:

1. Problem Statement: AI users face significant privacy concerns. It's difficult for users to detect if their privacy is compromised, while AI service providers struggle with the laborious task of removing sensitive user data from their datasets.

2. Inspiration and Methodology: The project draws inspiration from the research paper titled 'Athena: Probabilistic Verification of Machine Unlearning'. It proposes a protocol to achieve verifiable machine unlearning, a process crucial for safeguarding user privacy.

3. Protocol Overview:
   - Backdoor Attack: The protocol begins by conducting backdoor attacks to verify if the model indeed stores user data. This step provides substantial evidence for prompting model providers to initiate machine unlearning.
   - Machine Unlearning: After verifying the presence of stored user data, model providers are compelled to undergo machine unlearning. This process involves removing certain data from the model without necessitating full retraining, significantly reducing costs.
   - Validation through Inference and Hypothesis Testing: Multiple rounds of inference are conducted to detect any remaining backdoors. Hypothesis testing is then employed to derive convincing conclusions regarding the efficacy of the unlearning process.
   - Zero-Knowledge Proofs (ZKP): To ensure the integrity of inference results, zero-knowledge proofs are utilized to verify that the results indeed originate from the current model state, adding an extra layer of security and trust.

4. Role of Privacy Avengers: Privacy Avengers are individuals who champion data privacy. They play a crucial role in conducting backdoor attacks, monitoring the model's behavior to verify that the unlearning has indeed occurred, and verifying the integrity of inference results.

5. Final Outcome: Upon successful completion of the protocol, conclusive evidence is obtained regarding the effectiveness of machine unlearning. Privacy Avengers receive rewards for their contributions, ensuring accountability and incentivizing participation.

6. Safety Measures:
   - World ID: Implementation of world ID ensures secure data handling.
   - Verifier Smart Contracts on Layer 2 (L2): Deploying verifier smart contracts on Layer 2 ensures affordable transaction fees, enhancing accessibility and scalability.

Overall, this project offers a comprehensive solution to the complex challenge of ensuring privacy in AI systems through a meticulously designed protocol supported by advanced techniques and community participation.

## Get Started
### Frontend Set-up
1. Enter the frontend project folder 'frontend'
2. Download the dependencies by running the command:
   ```
   npm install
   ```
4. Launch the frontend server by running the command:
   ```
   npm run start
   ```

### Backend Set-up
1. Enter the frontend project folder 'backend'
2. Download the dependencies by running the command:
   ```
   npm install
   ```
3. Launch the backend server by running
   ```
   npm run start
   ```

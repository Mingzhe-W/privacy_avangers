import http from './http'

export async function handleVerifyWorldID(proof) {
  let url = '/verifyWorldID'
  let body = {
    proof: proof
  }
  
  try {
    const response = await http.post(url, body);
    console.log('response', response)
    let result = response;
    return result
  } catch (error) {
    console.error(error);
  }
}
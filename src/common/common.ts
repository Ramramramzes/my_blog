export const createConfig = () => {
  return {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
    }
  }
}
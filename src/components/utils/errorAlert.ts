const errorAlert = (err: any) => {
  if (err?.response?.data?.message) alert(err.response.data.message);
  else alert('알 수 없는 오류..');
};

export default errorAlert;

function getAddress() {
  if (process.env.NODE_ENV === 'production') {
    return process.env.DEPLOY_ADR;
  }
  return process.env.DEV_ADR;
}

export default getAddress;

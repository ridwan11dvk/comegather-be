export interface errorMsg{
  message: string,
  additional_info?: any,
}

export interface tokenResp{
  accessToken: string,
  refreshToken: string,
}

export interface defaultResp{
  data: any,
}

import { PageContainer } from '@ant-design/pro-layout';

const helloworldmind = (props) => {

  return (
    <>
    <h1>hello world, mind</h1>
      {props.children}
    </>
  );
};

export default helloworldmind;

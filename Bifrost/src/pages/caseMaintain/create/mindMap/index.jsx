import { PageContainer } from '@ant-design/pro-layout';

const helloworldmind = (props) => {

  return (
    <PageContainer
      content={
        <div
          style={{
            textAlign: 'center',
          }}
        >
            <h1>hello world, mind</h1>
        </div>
      }
    >
      {props.children}
    </PageContainer>
  );
};

export default helloworldmind;

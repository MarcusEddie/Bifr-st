import React from 'react';
import { Card } from 'antd';

const HeaderDetails = (props) => {

  const { apiHeaders } = props;
  let content = "";
  if (apiHeaders && apiHeaders.length > 0) {
    content = content.concat("<table border='1' width='100%'><tr><th width='50%'>Name</th><th width='50%'>Value</th></tr>");
    for (let i = 0; i < apiHeaders.length; i += 1) {
      content = content.concat('<tr><td>', apiHeaders[i].headerName, '</td><td>', apiHeaders[i].headerVal, '</td>');
    }
    content = content.concat("</table>");
  }
  
  return (
    <Card>
      <div style={{ height: props.height, overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: content }} />
    </Card>
  );
};

export default HeaderDetails;
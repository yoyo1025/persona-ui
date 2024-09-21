import * as React from 'react';
import { useParams } from 'react-router-dom';

const Conversation: React.FC = () => {
  const { id } = useParams();  // URLパラメータからidを取得

  return (
    <div>
      <h1>Conversation ID: {id}</h1>
      <p>ここに会話内容が表示されます。</p>
    </div>
  );
};

export default Conversation;

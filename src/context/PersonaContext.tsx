import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface Persona {
  id: number;
  userID: number;
  name: string;
  problems: string;
}

interface PersonaContextType {
  archive: Persona[];
  setArchive: React.Dispatch<React.SetStateAction<Persona[]>>;
}

// children の型定義を追加
interface PersonaProviderProps {
  children: ReactNode; // ReactNode 型を使うことで、コンポーネントツリー全体を受け取れる
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

// カスタムフック: コンテキストの値を取得するために使用
export const usePersonaContext = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersonaContext must be used within a PersonaProvider');
  }
  return context;
};

// コンテキストプロバイダー: アプリケーション全体にデータを提供
export const PersonaProvider: React.FC<PersonaProviderProps> = ({ children }) => {
  const [archive, setArchive] = useState<Persona[]>([]);

  // 初回レンダリング時にAPIからデータを取得
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await fetch('http://localhost:30000/1');
        const data = await response.json();
        setArchive(data);
      } catch (error) {
        console.error('通信エラー:', error);
      }
    };
    fetchPersonas();
  }, []);

  return (
    <PersonaContext.Provider value={{ archive, setArchive }}>
      {children} {/* children を正しく表示 */}
    </PersonaContext.Provider>
  );
};

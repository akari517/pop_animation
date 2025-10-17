// src/contexts/AuthContext.jsx (Supabase用に更新)
import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初回のセッション情報を取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // ログイン状態の変化を監視するリスナー
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // コンポーネントが不要になった時にリスナーを解除
    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    currentUser: session?.user, // 既存コードとの互換性のために残す
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
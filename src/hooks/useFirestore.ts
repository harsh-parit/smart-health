/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { testFirestoreConnection } from '../services/reportService';
import { getCollectionName } from '../lib/firebase';

export function useFirestore() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const result = await testFirestoreConnection();
      setIsConnected(result);
      return result;
    } catch (e) {
      setIsConnected(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    loading,
    getCollection: getCollectionName,
    checkConnection
  };
}

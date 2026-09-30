import { useState, useEffect } from 'react';
import { useServices } from '../di/ServiceContainer';

export function useStudentWallet() {
  const { paymentRegistry, notificationService } = useServices();
  const junaebGateway = paymentRegistry.junaebGateway;

  const [junaebBalance, setJunaebBalance] = useState<number>(junaebGateway.getBalance());

  useEffect(() => {
    const unsubscribe = junaebGateway.subscribeBalance(balance => {
      setJunaebBalance(balance);
    });
    return unsubscribe;
  }, [junaebGateway]);

  const toggleSimulation = () => {
    if (junaebBalance > 1000) {
      junaebGateway.setBalance(500);
      notificationService.notify(
        'Modo Saldo Insuficiente',
        'Saldo Beca JUNAEB configurado a $500 CLP para probar denegación y recuperación.',
        'amber'
      );
    } else {
      junaebGateway.setBalance(34500);
      notificationService.notify(
        'Saldo Restaurado',
        'Saldo Beca JUNAEB restaurado a $34.500 CLP.',
        'emerald'
      );
    }
  };

  const setBalanceDirectly = (amount: number) => {
    junaebGateway.setBalance(amount);
  };

  return {
    junaebBalance,
    isLowBalance: junaebBalance <= 1000,
    toggleSimulation,
    setBalanceDirectly
  };
}

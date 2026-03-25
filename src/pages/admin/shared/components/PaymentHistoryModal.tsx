import { FC, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getPaymentHistory, addPayment, type PaymentHistoryData } from '@/services/inscriptions/inscriptionService';
import { Spinner } from '@/components';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inscriptionId: string;
  studentName: string;
  coursePrice: number;
}

interface Payment {
  _id?: string;
  date: string;
  amount: number;
  paymentMethod?: string;
  notes?: string;
}

const PaymentHistoryModal: FC<PaymentHistoryModalProps> = ({ isOpen, onClose, inscriptionId, studentName, coursePrice }) => {
  const [historyData, setHistoryData] = useState<PaymentHistoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para el nuevo pago
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHistory = async () => {
    if (!inscriptionId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getPaymentHistory(inscriptionId);
      setHistoryData(response.data);
    } catch (err) {
      setError('No se pudo cargar el historial de pagos.');
      toast.error('No se pudo cargar el historial de pagos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    } else {
      // Resetear estado al cerrar
      setHistoryData(null);
      setAmount('');
      setPaymentMethod('');
      setNotes('');
    }
  }, [isOpen, inscriptionId]);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Por favor, ingresa un monto válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addPayment(inscriptionId, { amount: numericAmount, paymentMethod, notes });
      toast.success('Pago registrado correctamente.');
      // Resetear formulario y recargar historial
      setAmount('');
      setPaymentMethod('');
      setNotes('');
      fetchHistory();
    } catch (err) {
      toast.error('No se pudo registrar el pago.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) {
    return null;
  }

  const remainingBalance = coursePrice - (historyData?.totalPaid || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Historial de Pagos</h2>
            <p className="text-sm text-gray-600 capitalize">{studentName}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </header>

        <div className="p-6 overflow-y-auto">
          {loading && <div className="flex justify-center p-8"><Spinner /></div>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          {historyData && (
            <>
              {/* Tabla de historial */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Pagos Realizados</h3>
                {historyData?.history?.length > 0 ? (
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-sm font-semibold">Fecha</th>
                          <th className="p-3 text-sm font-semibold">Método</th>
                          <th className="p-3 text-sm font-semibold">Notas</th>
                          <th className="p-3 text-sm font-semibold text-right">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData.history.map((payment, index) => (
                          <tr key={`${payment._id}-${index}`} className="border-b">
                            <td className="p-3 text-sm">{new Date(payment.date).toLocaleDateString('es-AR')}</td>
                            <td className="p-3 text-sm">{payment.paymentMethod || '-'}</td>
                            <td className="p-3 text-sm">{payment.notes || '-'}</td>
                            <td className="p-3 text-sm font-mono text-right">${payment.amount.toLocaleString('es-AR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hay pagos registrados.</p>
                )}
              </div>

              {/* Resumen Financiero */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 flex justify-around text-center">
                <div>
                  <p className="text-sm text-gray-600">Total del Curso</p>
                  <p className="font-bold text-lg">${coursePrice.toLocaleString('es-AR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pagado</p>
                  <p className="font-bold text-lg text-green-600">${historyData.totalPaid.toLocaleString('es-AR')}</p>
                </div>
              </div>
              
              {/* Formulario para nuevo pago */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Registrar Nuevo Pago</h3>
                <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Ej: 5000"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                    <input
                      type="text"
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Ej: Transferencia, Efectivo"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      rows={2}
                      placeholder="Añadir notas adicionales (opcional)"
                    ></textarea>
                  </div>
                  <div className="md:col-span-3 text-right">
                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                      {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

        <footer className="p-4 bg-gray-50 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cerrar</button>
        </footer>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;

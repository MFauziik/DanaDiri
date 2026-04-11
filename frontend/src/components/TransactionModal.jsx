import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import TransactionForm from './TransactionForm';

const TransactionModal = ({ initialData = {}, isOpen, onClose, onSubmit }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const title = initialData._id ? 'Edit Transaksi' : 'Tambah Transaksi Baru';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="relative mx-auto p-6 border w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl rounded-2xl bg-white"
      >
        <div className="pb-6 border-b border-gray-100 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-[#1f2937]">
                {initialData._id ? 'Edit Transaksi' : 'Tambah Transaksi'}
              </h3>
              <p className="text-sm text-[#6b7280] mt-1">
                Catat pengeluaran atau pemasukan baru Anda dengan mudah
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <TransactionForm 
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default TransactionModal;


'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrinterIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrdersStore } from '@/stores/orders.store';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

const InvoicePage = () => {
  const params = useParams();
  const { t } = useTranslation();
  const { order, loading, getOrder } = useOrdersStore();

  useEffect(() => {
    if (params.id) {
      getOrder(params.id as string);
    }
  }, [params.id, getOrder]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="h-full p-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <Skeleton className="mb-4 h-4 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">{t('pages.invoice.not-found')}</h1>
      </div>
    );
  }

  const formattedDate = format(new Date(order.createdAt), 'dd/MM/yyyy');

  return (
    <section className="h-full">
      <div className="mx-auto max-w-4xl bg-white p-8 font-sans text-gray-800">
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body * {
              visibility: hidden;
            }
            .print-content,
            .print-content * {
              visibility: visible;
            }
            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 2rem;
            }
            .no-print {
              display: none !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .bg-primary {
              background-color: #1b5ffe !important;
            }
            .text-primary-foreground {
              color: #ffffff !important;
            }
            .border {
              border: 1px solid #e5e7eb !important;
            }
            .border-b {
              border-bottom: 1px solid #e5e7eb !important;
            }
            .border-x {
              border-left: 1px solid #e5e7eb !important;
              border-right: 1px solid #e5e7eb !important;
            }
          }
        `}</style>
        <div className="print-content">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="mb-8 text-4xl font-bold text-gray-800">{t('pages.invoice.title')}</h1>
              <div className="space-y-1">
                <p className="text-lg font-semibold">{t('pages.invoice.business-name')}</p>
                <p>{t('pages.invoice.business-address')}</p>
                <p>{t('pages.invoice.business-phone')}</p>
              </div>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-2 gap-8">
            <div>
              <h2 className="mb-2 text-lg font-semibold">{t('pages.invoice.bill-to')}</h2>
              <div className="space-y-1">
                <p className="font-medium">{order.orderItems[0]?.product?.name || t('pages.invoice.customer-name')}</p>
                <p>{t('pages.invoice.customer-address')}</p>
                <p>{t('pages.invoice.customer-phone')}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="mb-2 text-lg font-semibold">{t('pages.invoice.details')}</h2>
              <div className="mb-6 space-y-1">
                <p className="flex items-center justify-end">
                  <span className="font-semibold">{t('pages.invoice.number')}:</span>
                  <span className="ml-2">#{order.id.slice(-6)}</span>
                </p>
                <p>
                  <span className="font-semibold">{t('pages.invoice.date')}:</span> {formattedDate}
                </p>
                <p>
                  <span className="font-semibold">{t('pages.invoice.status')}:</span> {order.status}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-4 rounded-t-md bg-primary p-3 text-primary-foreground">
              <div>{t('pages.invoice.item')}</div>
              <div className="text-center">{t('pages.invoice.quantity')}</div>
              <div className="text-center">{t('pages.invoice.price')}</div>
              <div className="text-right">{t('pages.invoice.amount')}</div>
            </div>
            <div className="border-x border-b">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-4 border-b p-3 last:border-b-0">
                  <div className="text-left">{item.product?.name || 'N/A'}</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-center">{formatCurrency(item.price)}</div>
                  <div className="text-right">{formatCurrency(item.total)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md p-3 text-primary">
            <span className="font-bold">{t('pages.invoice.total')}</span>
            <span className="text-xl font-bold">{formatCurrency(order.total)}</span>
          </div>

          {order.discount > 0 && (
            <div className="mt-2 flex items-center justify-between rounded-md p-3 text-red-500">
              <span className="font-bold">{t('pages.invoice.discount')}</span>
              <span className="text-xl font-bold">-{formatCurrency(order.discount)}</span>
            </div>
          )}

          <div className="mt-8 flex flex-col items-end">
            <Button onClick={handlePrint} variant="outline" className="no-print">
              <PrinterIcon className="mr-2 h-4 w-4" />
              {t('pages.invoice.print')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoicePage;

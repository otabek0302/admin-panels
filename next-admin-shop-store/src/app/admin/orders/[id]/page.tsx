'use client';

import Image from 'next/image';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrinterIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrdersStore } from '@/stores/orders.store';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { logo, qr_code } from '@/assets';

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
              padding: 1rem;
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

            /* Repeat the table header on every page */
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }

            /* Prevent rows and blocks from splitting across pages */
            tr,
            .row-avoid {
              break-inside: avoid;
              page-break-inside: avoid;
              -webkit-column-break-inside: avoid;
              -webkit-region-break-inside: avoid;
            }

            /* Make sure parent containers don't force weird splits */
            .print-content,
            table {
              width: 100%;
            }
          }
        `}</style>
        <div className="print-content">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="mb-2 text-sm font-semibold">{t('pages.invoice.bill-to')}</h2>
              <div className="space-y-1 text-sm">
                <p>{t('pages.invoice.customer-name')}</p>
                <p>{t('pages.invoice.customer-address')}</p>
                <p>{t('pages.invoice.customer-phone')}</p>
              </div>
            </div>
            <div className="flex flex-1 justify-center">
              <Image src={logo} alt="logo" width={128} height={128} className="object-contain" />
            </div>
            <div className="flex-1 text-right">
              <h2 className="mb-2 text-sm font-semibold">{t('pages.invoice.details')}</h2>
              <div className="mb-2 space-y-1 text-sm">
                <p className="flex items-center justify-end">
                  <span className="text-[10px] font-semibold">{t('pages.invoice.number')}:</span>
                  <span className="ml-2">#{order.id.slice(-6)}</span>
                </p>
                <p>
                  <span className="text-[10px] font-semibold">{t('pages.invoice.date')}:</span> {formattedDate}
                </p>
                <p>
                  <span className="text-[10px] font-semibold">{t('pages.invoice.status')}:</span> {order.status}
                </p>
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="mb-2">
            <table className="w-full border border-gray-200">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-4 py-1 text-left text-sm"> {t('pages.invoice.item')} </th>
                  <th className="border-x px-4 py-1 text-center text-sm"> {t('pages.invoice.quantity')} </th>
                  <th className="px-4 py-1 text-center text-sm"> {t('pages.invoice.price')} </th>
                  <th className="border-l px-4 py-1 text-right text-sm"> {t('pages.invoice.amount')} </th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, idx) => (
                  <tr key={idx} className="row-avoid border-t">
                    <td className="truncate px-4 py-1 text-sm" title={item.product?.name || 'N/A'}>
                      {item.product?.name || 'N/A'}
                    </td>
                    <td className="border-x px-4 py-1 text-center text-sm">{item.quantity}</td>
                    <td className="px-4 py-1 text-center text-sm">{formatCurrency(item.price)}</td>
                    <td className="border-l px-4 py-1 text-right text-sm">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row-avoid">
            <div className="flex items-center justify-between">
              <div className="mt-2 flex flex-col items-start justify-between rounded-md px-0.5 text-primary">
                <span className="text-sm font-bold">STROY BAZA</span>
                <span className="text-sm font-bold">BABIROV MAKSUD</span>
                <span className="text-sm font-bold">+998-(91)-530-55-50</span>
                <span className="text-sm font-bold">+998-(98)-573-55-03</span>
              </div>
              <div className="flex flex-1 justify-center">
                <Image src={qr_code} alt="logo" width={80} height={80} className="object-contain" />
              </div>
              <div className="mt-2 flex flex-col items-end justify-between rounded-md px-0.5 text-primary">
                <span className="text-sm font-bold">{t('pages.invoice.total')}</span>
                <span className="text-sm font-bold">{formatCurrency(order.total)}</span>
              </div>
            </div>

            {order.discount > 0 && (
              <div className="mt-2 flex items-center justify-between rounded-md px-0.5 text-red-500">
                <span className="text-sm font-bold">{t('pages.invoice.discount')}</span>
                <span className="text-sm font-bold">-{formatCurrency(order.discount)}</span>
              </div>
            )}
          </div>

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

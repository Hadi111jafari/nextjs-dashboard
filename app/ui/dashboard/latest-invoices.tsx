"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { lusitana } from "@/app/ui/fonts";
import { LatestInvoice } from "@/app/lib/definitions";

export default function LatestInvoices() {
  const [invoices, setInvoices] = useState<LatestInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAll, setIsAll] = useState(false);

  useEffect(() => {
    const fetchInitialInvoices = async () => {
      try {
        const response = await fetch("/api/fetchIncoices");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const initialInvoices = await response.json();
        setInvoices(initialInvoices);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    };

    fetchInitialInvoices();
  }, []);

  const loadMoreInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetchIncoices?all=true");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newInvoices = await response.json();
      setInvoices(newInvoices);
      setIsAll(true)
    } catch (error) {
      console.error("Failed to load more invoices:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        {isAll ? "All Invoices" : "Latest Invoices"}
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {invoices?.map((invoice, i) => (
            <div
              key={invoice.id}
              className={clsx(
                "flex flex-row items-center justify-between py-4",
                { "border-t": i !== 0 },
              )}
            >
              <div className="flex items-center">
                <Image
                  src={invoice.image_url}
                  alt={`${invoice.name}'s profile picture`}
                  className="mr-4 rounded-full"
                  width={32}
                  height={32}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {invoice.name}
                  </p>
                  <p className="hidden text-sm text-gray-500 sm:block">
                    {invoice.email}
                  </p>
                </div>
              </div>
              <p
                className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
              >
                {invoice.amount}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        </div>
      </div>
      {!isAll ? (
        <button
          onClick={loadMoreInvoices}
          className="mt-4 rounded bg-blue-500 p-2 text-white"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      ) : null}
    </div>
  );
}

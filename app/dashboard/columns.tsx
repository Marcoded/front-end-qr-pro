"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { format, parseISO } from "date-fns";
import CopyUrlToClipboard from "@/components/ui/copyToClipboard";
import DeleteQrCodeFromID from "@/components/ui/deleteQrCode";
import { QrForm } from "@/components/QrForm";

export type Qrcode = {
  clerk_user_id: string;
  title: string;
  target_url: string;
  qr_code_data: string;
  created_at: string;
  updated_at: string;
  id: string;
};

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const generateSvgUrl = (svg_data: string) => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg_data)}`;
};

export const columns: ColumnDef<Qrcode>[] = [
  {
    accessorKey: "title",
    header: "title",
  },
  {
    accessorKey: "target_url",
    header: "Target_url",
    cell: ({ row }) => {
      const target_url: string = row.getValue("target_url") || "";
      const display_url: string = `${target_url.slice(0, 30)}...`;
      return (
        <a target="_blank" rel="noreferrer" href={target_url}>
          {display_url}
        </a>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = parseISO(row.getValue("created_at"));
      const formattedDate = format(date, "dd.MM.yyyy HH:mm");
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = parseISO(row.getValue("updated_at"));
      const formattedDate = format(date, "dd.MM.yyyy - HH:mm");
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const qrcode = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <CopyUrlToClipboard text={qrcode.target_url} />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

         
            <QrForm
              mode="edit"
              facadeText="Edit Qr code"
              qrCodeIdFromProps={qrcode.id}
              styling="dropdownElement"
            />
           
          
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <a
                href={generateSvgUrl(qrcode.qr_code_data)}
                download="image.svg"
              >
                Download SVG{" "}
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="bg-destructive text-destructive-foreground ">
              <DeleteQrCodeFromID qrCodeID={qrcode.id} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

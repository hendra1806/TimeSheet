import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import colors from "@/styles/colors";

interface Kegiatan {
  id: number;
  activityname: string;
  projectid: number;
  startdate: string;
  enddate: string;
  starttime: string;
  endtime: string;
  projectname: string;
  [key: string]: string | number;
}

interface KegiatanListProps {
  data: Kegiatan[];
  rate: number;
}

const KegiatanList: React.FC<KegiatanListProps> = ({ data, rate }) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  function FormatedDate(tanggal: string): string {
    const bulanStr: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ags",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    const dateObj = new Date(tanggal);
    const tanggalStr = dateObj.getDate();
    const bulan = bulanStr[dateObj.getMonth()];
    const tahun = dateObj.getFullYear();

    return `${tanggalStr} ${bulan} ${tahun}`;
  }

  function FormatedTime(waktu: string): string {
    const dateObj = new Date(`2000-01-01T${waktu}`);
    const jam = dateObj.getHours().toString().padStart(2, "0");
    const menit = dateObj.getMinutes().toString().padStart(2, "0");

    return `${jam}:${menit}`;
  }

  function FormatedDuration(milisec: number): string {
    const totalHours = Math.floor(milisec / (1000 * 60 * 60));
    const totalMinutes = Math.floor((milisec % (1000 * 60 * 60)) / (1000 * 60));

    const totalDuration = `${totalHours} jam ${totalMinutes} menit`;
    return totalDuration;
  }

  function calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    const diffMs = end.getTime() - start.getTime();
    return diffMs;
  }

  function calculateIncome(milliseconds: number, rate: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    const income = (rate / 60) * minutes;

    const incomeFormatted = income.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return incomeFormatted;
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3003/activity-list/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'ActivityList deleted successfully',
        }).then(() => {
          window.location.reload();
        });
      } else {
        console.error("Failed to delete ActivityList:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting ActivityList:", error);
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    if (sortDirection === "asc") {
      return a[sortField] < b[sortField] ? -1 : 1;
    } else {
      return a[sortField] > b[sortField] ? -1 : 1;
    }
  });

  function calculateTotalDuration(data: any) {
    let totalDurationMs = 0;

    data.forEach((kegiatan: Kegiatan) => {
      const durasiMs = calculateDuration(kegiatan.starttime, kegiatan.endtime);
      totalDurationMs += durasiMs;
    });

    return totalDurationMs;
  }

  return (
    <Paper style={{ margin: "10px", borderRadius: 20 }}>
      <Table style={{ margin: "10px", borderRadius: 20 }}>
        <TableHead sx={{ height: "30px" }}>
          <TableRow sx={{ height: "30px" }}>
            <TableCell
              sx={{
                fontSize: "10px",
                height: "30px",
                minWidth: "200px",
                maxWidth: "300px",
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex" }}>
                Judul Kegiatan
                <IconButton onClick={() => handleSort("judul")}>
                  <SwapVertRoundedIcon fontSize="small" />
                </IconButton>
              </div>
            </TableCell>
            <TableCell
              sx={{
                fontSize: "10px",
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex" }}>
                Nama Proyek
                <IconButton onClick={() => handleSort("namaProyek")}>
                  <SwapVertRoundedIcon fontSize="small" />
                </IconButton>
              </div>
            </TableCell>
            <TableCell
              sx={{
                fontSize: "10px",
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex" }}>
                Tanggal Mulai
                <IconButton onClick={() => handleSort("tanggalMulai")}>
                  <SwapVertRoundedIcon fontSize="small" />
                </IconButton>
              </div>
            </TableCell>
            <TableCell
              sx={{
                fontSize: "10px",
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex" }}>
                Tanggal Berakhir
                <IconButton onClick={() => handleSort("tanggalBerakhir")}>
                  <SwapVertRoundedIcon fontSize="small" />
                </IconButton>
              </div>
            </TableCell>
            <TableCell
              sx={{
                fontSize: "10px",
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex" }}>
                Waktu Mulai
                <IconButton onClick={() => handleSort("waktuMulai")}>
                  <SwapVertRoundedIcon fontSize="small" />
                </IconButton>
              </div>
            </TableCell>
            <TableCell
              sx={{
                fontSize: "10px",
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex" }}>
                Waktu Berakhir
                <IconButton onClick={() => handleSort("waktuBerakhir")}>
                  <SwapVertRoundedIcon fontSize="small" />
                </IconButton>
              </div>
            </TableCell>
            <TableCell
              sx={{
                fontSize: "10px",
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex" }}>
                Durasi
                <IconButton onClick={() => handleSort("durasi")}>
                  <SwapVertRoundedIcon fontSize="small" />
                </IconButton>
              </div>
            </TableCell>
            <TableCell sx={{ fontSize: "10px" }}>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((kegiatan) => (
              <TableRow key={kegiatan.id}>
                <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                  {kegiatan.activityname}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                  {kegiatan.projectname}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                  {FormatedDate(kegiatan.startdate)}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                  {FormatedDate(kegiatan.enddate)}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                  {FormatedTime(kegiatan.starttime)}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                  {FormatedTime(kegiatan.endtime)}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                  {FormatedDuration(
                    calculateDuration(kegiatan.starttime, kegiatan.endtime)
                  )}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(kegiatan.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                Belum ada kegiatan
              </TableCell>
            </TableRow>
          )}
          {sortedData.length > 0 && (
            <TableRow style={{ backgroundColor: colors.backgroundPage }}>
              <TableCell colSpan={8}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: colors.blue,
                  }}
                >
                  <div>
                    <div>Total Durasi</div>
                    <div style={{ fontWeight: "bold" }}>Total Pendapatan</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <div>
                      {FormatedDuration(calculateTotalDuration(sortedData))}
                    </div>
                    <div style={{ fontWeight: "bold" }}>
                      {calculateIncome(
                        calculateTotalDuration(sortedData),
                        rate
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default KegiatanList;

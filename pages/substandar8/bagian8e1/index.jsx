import React, { useEffect, useState } from "react";
import Wrapper from "../../../layouts/wrapper";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Head from "next/head";
import { useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";
import TemplateTabel from "../../../layouts/TablePageTemplate";

export default function Bagian1() {
  const [data, setData] = useState([]);
  const { pathname } = useRouter();
  const { getMe } = useSelector((state) => state);
  const { user } = getMe;

  const apiEndPoint = `sub8/bag8E1`;

  const getData = async () => {
    try {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${apiEndPoint}`
      );
      setData(data.data.data);
      $(document).ready(function () {
        $("#dataTable").DataTable();
      });
    } catch (error) {
      console.log(error);
      toast.error(`Error Getting Data :  ${error.message}`);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const action = async (id, act) => {
    try {
      if (act == "delete") {
        const data = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${apiEndPoint}/${id}`
        );
        toast.success(`Berhasil Melakukan Aksi`);
      } else {
        const data = await axios.put(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${apiEndPoint}/${id}`,
          {
            isAccepted: act == "accept" ? "accepted" : "declined",
          }
        );
        toast.success(`Berhasil Melakukan Aksi`);
      }
      getData();
    } catch (error) {
      toast.error(`Gagal Melakukan Aksi Karena ${error.message}`);
      console.log(error);
    }
  };
  return (
    <>
      <Head>
        <title>Substandar8 - Bagian 8-E-1</title>
      </Head>
      <TemplateTabel
        titleHeader={" Tabel 8.e.1 Tempat Kerja Lulusan"}
        titleTable={" Tabel 8.e.1 Tempat Kerja Lulusan"}
        titleSmall={
          "   Diisi oleh pengusul dari Program Studi pada program Diploma Tiga/Sarjana/Sarjana Terapan"
        }
      >
        <table id="dataTable" className="display table table-bordered ">
          <thead>
            <tr>
              <th rowSpan="2" className="text-center">
                Tahun Lulus
              </th>
              <th rowSpan="2" className="text-center">
                Jumlah Lulusan
              </th>
              <th rowSpan="2" className="text-center">
                Jumlah Lulusan yang Terlacak
              </th>
              <th colSpan="3" className="text-center">
                Jumlah Lulusan Terlacak yang Bekerja Berdasarkan Tingkat/Ukuran
                Tempat Kerja/Berwirausaha
              </th>
              {user.role == "admin" && <th rowSpan={2}>User</th>}
              <th rowSpan="2" className="text-center">
                Aksi
              </th>
            </tr>

            <tr>
              <td>Lokal/ Wilayah/ Berwirausaha tidak Berbadan Hukum</td>
              <td>Nasional/ Berwirausaha Berbadan Hukum</td>
              <td>Multinasional/ Internasional</td>
            </tr>
          </thead>
          <tbody>
            {data.map((e, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{e.tahunLulus}</td>
                <td>{e.jumlahLulusan}</td>
                <td>{e.jumlahBerdasarkanTingkat.lokal}</td>
                <td>{e.jumlahBerdasarkanTingkat.nasional}</td>
                <td>{e.jumlahBerdasarkanTingkat.internasional}</td>

                {user.role == "admin" && <td>{e.user.fullName}</td>}
                <td>
                  {user.role == "admin" && !e.isAccepted && (
                    <div>
                      <button
                        className="btn btn-success btn-sm "
                        type="button"
                        onClick={() => action(e._id, "accept")}
                      >
                        <i className="fas fa-check"></i> Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm "
                        type="button"
                        onClick={() => action(e._id, "decline")}
                      >
                        <i className="fas fa-times"></i> Decline
                      </button>
                    </div>
                  )}
                  {user.role == "admin" && e.isAccepted && (
                    <div>
                      <button
                        className={`btn btn-${
                          e.isAccepted == "declined" ? "danger" : "success"
                        } btn-sm disabled`}
                        type="button"
                        disabled
                      >
                        <i
                          className={`fas fa-${
                            e.isAccepted == "accepted" ? "check" : "times"
                          }`}
                        ></i>
                        {e.isAccepted == "declined"
                          ? "Declined"
                          : e.isAccepted == "accepted" && "Accepted"}
                      </button>
                    </div>
                  )}
                  {user.role == "prodi" && (
                    <div>
                      <Link href={`${pathname}/${e._id}`}>
                        <a className="btn btn-success btn-sm " type="button">
                          <i className="fa fa-edit"></i> Edit
                        </a>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm "
                        type="button"
                        onClick={() => action(e._id, "delete")}
                      >
                        <i className="fa fa-trash"></i> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TemplateTabel>
    </>
  );
}

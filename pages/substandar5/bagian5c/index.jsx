import Script from "next/script";
import React, { useEffect, useState } from "react";
import Wrapper from "../../../layouts/wrapper";
import { useRouter } from "next/router";
import UseScript from "../../../layouts/UseScript";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import TemplateTabel from "../../../layouts/TablePageTemplate";
import Link from "next/link";
import { setChartData } from "../../../store/ChartModalSlice";

export default function Bagian1() {
  const [data, setData] = useState([]);
  const { pathname } = useRouter();
  const { getMe } = useSelector((state) => state);
  const { user } = getMe;
  const dispatch = useDispatch();
  const apiEndPoint = `sub5/bag5C`;

  const getData = async () => {
    try {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${apiEndPoint}`
      );
      setData(data.data.data);
      $(document).ready(function () {
        $("#dataTable").DataTable();
      });
      let statusVerifikasi = {
        accepted: 0,
        declined: 0,
        unverif: 0,
      };
      let pengirim = {};
      let tingkatKepuasanMahasiswa = {
        sangatBaik: 0,
        baik: 0,
        cukup: 0,
        kurang: 0,
      };
      data.data.data.map((e) => {
        e.isAccepted && e.isAccepted == "accepted"
          ? statusVerifikasi.accepted++
          : e.isAccepted == "declined"
          ? statusVerifikasi.declined++
          : statusVerifikasi.unverif++;
        if (e.user) {
          pengirim[e.user.fullName]
            ? pengirim[e.user.fullName]++
            : (pengirim[e.user.fullName] = 1);
        }
        tingkatKepuasanMahasiswa.sangatBaik += Number(
          e.tingkatKepuasanMahasiswa.sangatBaik
        );
        tingkatKepuasanMahasiswa.baik += Number(
          e.tingkatKepuasanMahasiswa.baik
        );
        tingkatKepuasanMahasiswa.cukup += Number(
          e.tingkatKepuasanMahasiswa.cukup
        );
        tingkatKepuasanMahasiswa.kurang += Number(
          e.tingkatKepuasanMahasiswa.kurang
        );
      });
      dispatch(
        setChartData([
          {
            type: "line",
            title: "Prodi",
            labels: Object.keys(pengirim),

            datasets: [
              {
                label: "Banyak Data Dari Prodi",
                data: Object.values(pengirim),

                backgroundColor: [
                  "rgba(242, 0, 255, 0.5)",
                  "rgba(255, 0, 0, 0.5)",
                  "rgba(255, 0, 0, 0.1)",
                ],
                borderColor: [
                  "rgba(242, 0, 255, 1)",
                  "rgba(255, 0, 0, 1)",
                  "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          {
            type: "pie",
            title: "Status Verifikasi",
            labels: ["Disetujui", "Ditolak", "Belum Diverifikasi"],
            datasets: [
              {
                label: "# of Votes",
                data: [
                  statusVerifikasi.accepted,
                  statusVerifikasi.declined,
                  statusVerifikasi.unverif,
                ],
                backgroundColor: [
                  "rgba(242, 0, 255, 0.5)",
                  "rgba(255, 0, 0, 0.5)",
                  "rgba(255, 0, 0, 0.1)",
                ],
                borderColor: [
                  "rgba(242, 0, 255, 1)",
                  "rgba(255, 0, 0, 1)",
                  "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          {
            type: "bar",
            title: "Tingkat Kepuasan %",
            labels: Object.keys(tingkatKepuasanMahasiswa),
            datasets: [
              {
                label: "Puas",
                data: Object.values(tingkatKepuasanMahasiswa),
                backgroundColor: [
                  "rgba(242, 0, 255, 0.5)",
                  "rgba(255, 0, 0, 0.5)",
                  "rgba(255, 0, 0, 0.1)",
                ],
                borderColor: [
                  "rgba(242, 0, 255, 1)",
                  "rgba(255, 0, 0, 1)",
                  "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
        ])
      );
    } catch (error) {
      console.log(error);
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
        <title>Substandar5 - Bagian 5-C</title>
      </Head>
      <TemplateTabel
        data={data}
        titleHeader={`Substandar5 - Bagian 5-C`}
        titleTable={`Substandar5 - Bagian 5-C`}
      >
        <table
          id="dataTable"
          className="display table table-bordered"
          style={{ width: "100%", height: "100%" }}
        >
          <thead>
            <tr>
              <th rowSpan="2" className="text-center">
                Nomor
              </th>
              <th rowSpan="2" className="text-center">
                Aspek yang Diukur
              </th>
              <th colSpan="4" className="text-center">
                Tingkat Kepuasan Mahasiswa (%)
              </th>
              <th rowSpan="2" className="text-center">
                Rencana Tindak Lanjut oleh UPPS/PS
              </th>
              {user.role == "admin" && (
                <th rowSpan="2" className="text-center">
                  Aksi
                </th>
              )}
              <th rowSpan="2" className="text-center">
                Aksi
              </th>
            </tr>
            <tr>
              <td className="text-center">Sangat Baik</td>
              <td className="text-center">Baik</td>
              <td className="text-center">Cukup</td>
              <td className="text-center">Kurang</td>
            </tr>
          </thead>
          <tbody>
            {data.map((e, i) => (
              <tr key={i}>
                <td
                  className={`${
                    user.role == "prodi" &&
                    ((e.isAccepted == "accepted" && "bg-success text-light") ||
                      (e.isAccepted == "declined" && "bg-danger text-light"))
                  }`}
                >
                  {i + 1}.
                </td>
                <td>{e.aspekYangDiukur}</td>
                <td>{e.tingkatKepuasanMahasiswa.sangatBaik + "%"}</td>
                <td>{e.tingkatKepuasanMahasiswa.baik + "%"}</td>
                <td>{e.tingkatKepuasanMahasiswa.cukup + "%"}</td>
                <td>{e.tingkatKepuasanMahasiswa.kurang + "%"}</td>
                <td>{e.rencanaTindakLanjut}</td>
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

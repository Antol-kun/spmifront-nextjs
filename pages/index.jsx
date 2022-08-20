import Head from "next/head";
import Wrapper from "../layouts/wrapper";
import Jam from "../layouts/LiveClock";
import Tanggal from "../layouts/Moment";
import { useState, useEffect, Profiler } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
export default function Home(props) {
  const { getMe } = useSelector((state) => state);
  const [mahasiswa, setmahasiswa] = useState(0);
  const [dosen, setdosen] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const [title, setTitle] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [profile, setprofile] = useState({});
  const submit = async (val) => {
    const data = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/edit-profile`,
      {
        ...val,
      }
    );
    setInitialValues({});
    setIsShow(false);
    getProfile();
    try {
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfile = async () => {
    try {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/get-profile`
      );
      setprofile(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    const mahasiswa = await axios.get(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sub2/bag1`
    );
    let jumlahMahasiswaAktif = 0;
    mahasiswa.data.data.map((e) => {
      jumlahMahasiswaAktif +=
        Number(e.jumlahMahasiswaAktif.reguler) +
        Number(e.jumlahMahasiswaAktif.transfer);
    });
    setmahasiswa(jumlahMahasiswaAktif);

    const dsn = await axios.get(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sub3/bagA1`
    );
    setdosen(dsn.data.data.length);
  };

  useEffect(() => {
    getData();
    getProfile();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Wrapper>
        <div className="container-fluid">
          {/* <!-- Page Heading --> */}
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">
              {getMe.user ? `Halo ${getMe.user.fullName}...` : "Dashboard"}
            </h1>
          </div>
          <div className="row">
            <div className="col-sm-6"></div>
          </div>
          {/* <!-- Content Row --> */}
          <div className="row">
            {/* <!-- Earnings (Monthly) Card Example --> */}
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-dark shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-dark text-uppercase mb-1">
                        TOTAL MAHASISWA
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {mahasiswa}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-user fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Earnings (Monthly) Card Example --> */}
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-dark text-uppercase mb-1">
                        TOTAL DOSEN
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {dosen}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-danger shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-dark text-uppercase mb-1">
                        Jam Saat Ini
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <Jam/>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-dark text-uppercase mb-1">
                        Tanggal Hari Ini
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        <Tanggal/>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="row">
            <div className="col-6 my-3">
              <div className="card">
                <div className="card-header">
                  <div className="row  justify-content-between items-center ">
                    <h5>VISI PRODI</h5>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setInitialValues({});
                        setTitle("Ubah Visi");
                        setInitialValues({ visi: profile.visi });
                        setIsShow(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                    {profile.visi}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 my-3">
              <div className="card">
                <div className="card-header">
                  <div className="row  justify-content-between items-center ">
                    <h5>MISI PRODI</h5>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setInitialValues({});
                        setTitle("Ubah Misi");
                        setInitialValues({
                          misi: profile.misi,
                        });
                        setIsShow(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                    {profile.misi || "Misi Belum Di isi"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 my-3">
              <div className="card">
                <div className="card-header">
                  <div className="row  justify-content-between items-center ">
                    <h5>TUJUAN PRODI</h5>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setInitialValues({});
                        setTitle("Ubah Tujuan");
                        setInitialValues({
                          tujuan: profile.tujuan,
                        });
                        setIsShow(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                    {profile.tujuan || "Tujuan Belum Di isi"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 my-3">
              <div className="card">
                <div className="card-header">
                  <div className="row  justify-content-between items-center ">
                    <h5>SASARAN PRODI</h5>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setInitialValues({});
                        setTitle("Ubah Sasaran");
                        setInitialValues({
                          sasaran: profile.sasaran,
                        });
                        setIsShow(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                    {profile.sasaran || "Sasaran Belum Di isi"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
      <div
        style={{
          display: isShow ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          position: "fixed",
          inset: 0,
          zIndex: 20,
        }}
        className="p-5"
      >
        <div
          style={{
            zIndex: 15,
            // position: "fixed",
            // width: "100%",
            background: "white",
          }}
          className="col-md-6 p-5 rounded"
        >
          <Formik
            onSubmit={submit}
            initialValues={initialValues}
            enableReinitialize={true}
          >
            <Form>
              <div className="col">
                <div className="form-group">
                  <label className="h4" htmlFor="field1">
                    {title}
                  </label>
                  <Field
                    id="field1"
                    as="textarea"
                    type="text"
                    className="form-control"
                    name={`${Object.keys(initialValues)[0]}`}
                    style={{ minHeight: "150px" }}
                  ></Field>
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
        <div
          onClick={() => setIsShow(false)}
          style={{
            background: "black",
            inset: 0,
            position: "fixed",
            zIndex: 10,
            opacity: "25%",
          }}
        ></div>
      </div>
    </>
  );
}

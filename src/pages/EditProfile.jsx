/* eslint-disable react-hooks/rules-of-hooks */
import { BiChevronRight } from "react-icons/bi"
import { useEffect } from "react";
import { useApiGet, useApiPut } from "../services/apiService";
import { useForm } from "react-hook-form";
import { toastError, toastSuccess } from "../services/toatsService";

const EditProfile = () => {
     const {
          register,
          handleSubmit,
          setValue,
          formState: { errors },
     } = useForm();

     const userId = localStorage.getItem("userId");

     const fetchUser = async () => {
          try {
               const res = await useApiGet(`/user/${userId}`);
               setValue('fullname', res.data.fullname)
               setValue('no_telp', res.data.no_telp)
               setValue('bio', res.data.bio)
          } catch (error) {
               console.log(error);
          }
     }

     useEffect(() => {
          fetchUser();
     }, []);

     const onUpdate = async (data) => {
          try {
               const res = await useApiPut(`/user/edit-profile/${userId}`, data)
               console.log(res);
               toastSuccess(`sukses ${res.data.message}`)
          } catch (error) {
               toastError('gagal')
               console.log(error);
          }
     }

     return (
          <div className="my-14 mx-10">

               <div className="breadcrumb">
                    <span className="breadcrumb-no-active text-gray-breadcrumb"><a href="#">Profile</a></span>
                    <span className="breadcrumb-divider text-gray-breadcrumb"> <BiChevronRight /> </span>
                    <span className="breadcrumb-active text-blue-breadcrumb"><a href="#">Edit Profile</a></span>
               </div>

               <h1 className="text-3xl font-bold mt-10 black-breadcrumb">Edit Profil</h1>
               <p className="text-md mt-1 mb-5 text-gray-breadcrumb-secondary">Dibawah ini merupakan informasi yang bisa diubah</p>

               <form onSubmit={handleSubmit(onUpdate)} className="lg:w-1/2 md:w-1/2 sm:w-3/5">
                    <label htmlFor="fullname">Nama lengkap</label>
                    <input type="text" className="mt-2" name="fullname" id="fullname"
                         {...register('fullname', {
                              required: true
                         })}
                    />

                    <div>
                         <label htmlFor="no_telp">Nomor Telpon</label>
                         <input type="text" className="mt-2" name="no_telp" id="no_telp"
                              {...register('no_telp', {
                                   required: "Phone number required"
                              })}
                         />
                         {errors.no_telp && (
                              <span className="text-sm text-red-error">{errors.no_telp.message}</span>
                         )}
                    </div>

                    <div>
                         <label htmlFor="bio" className="mb-2">Tentang saya</label>
                         <textarea name="bio" id="bio" className="mt-2"
                              {...register('bio', {
                                   required: "About me must be filled"
                              })}
                         ></textarea>
                         {errors.bio && (
                              <span className="text-sm text-red-error">{errors.bio.message}</span>
                         )}
                    </div>

                    <button className="btn-profile bg-black-breadcrumb text-white-breadcrumb hover:bg-black-breadcrumb-secondary">simpan</button>
                    <div className="border-bottom text-input-gray"></div>
               </form >
          </div >
     )
}

export default EditProfile

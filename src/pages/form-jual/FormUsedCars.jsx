/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react"
import { FaPlus, FaTimes } from "react-icons/fa"
import { useForm } from "react-hook-form"
import ImageUploading from "react-images-uploading"
import Modal from "react-modal"
import axios from "axios"
import { ToastContainer } from "react-toastify"
import { toastSuccess, toastError } from "../../services/toatsService"
import { Spinner } from "flowbite-react"
import { useApiGet, useApiPost } from "../../services/apiService"

const FormUsedCars = () => {
     const {
          register,
          handleSubmit,
          formState: { errors },
          reset,
     } = useForm()

     const [images, setImages] = useState([])
     const [modalIsOpen, setModalIsOpen] = useState(false)
     const [selectedImage, setSelectedImage] = useState(null)
     const [categories, setCategories] = useState([])
     const [loading, setLoading] = useState(false)
     const maxNumber = 6

     let urlImageUploaded = []

     useEffect(() => {
          const fetchCategory = async () => {
               try {
                    const res = await useApiGet('/category');
                    setCategories(res.data?.data);
               } catch (error) {
                    console.log('error my category:', error);
               }
          }
          fetchCategory()
     }, [])

     /* Buat ENV */
     const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
     const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY
     const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

     const uploadImage = async (imageFile) => {
          const formData = new FormData()
          formData.append('file', imageFile)
          formData.append("upload_preset", uploadPreset);
          formData.append("api_key", apiKey);

          try {
               const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
               urlImageUploaded.push(response.data.secure_url)
          } catch (e) {
               alert(e)
          }
     }

     const onChange = (imageList) => {
          setImages(imageList);
     };

     const openModal = (index) => {
          setSelectedImage(index);
          setModalIsOpen(true);
     };

     const closeModal = () => {
          setSelectedImage(null);
          setModalIsOpen(false);
     };

     const submitForm = async (data) => {
          try {

               const dataForm = {
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    categoryId: data.category,
                    image: urlImageUploaded
               }

               await useApiPost('/user/advert', dataForm);

               reset()
               setImages([])
               toastSuccess('Iklan sukses dibuat')
               urlImageUploaded = []
          } catch (error) {
               console.error(error);
               toastError('Iklan gagal dibuat!')
          }
     }

     const onSubmit = async (data) => {
          try {
               setLoading(true)

               if (images.length === 0 || images.length > maxNumber) {
                    throw Error('Tolong minimal 1 gambar dan maksimal 6 gambar')
               }

               const uploadedImage = await Promise.all(
                    images.map((image) => uploadImage(image.file))
               )

               await submitForm({
                    ...data,
                    photos: uploadedImage,
               })
               setLoading(false)
          } catch (error) {
               console.error(error);
               toastError('Iklan gagal dibuat!')
               setLoading(false)
          }
     };

     return (
          <div className="max-w-5xl h-auto mx-auto md:py-0 px-5">
               <div className="bg-primary p-6 text-white-breadcrumb">
                    <h1 className="text-2xl font-bold mb-2">KAMU INGIN MENJUAL</h1>
               </div>
               <p className="my-4 font-medium text-xs">
                    SILAHKAN ISI FORM DIBAWAH INI DENGAN BENAR
               </p>

               <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-wrap">
                    <div className="w-full sm:w-1/2">

                         <div className="mb-2">
                              <label htmlFor="category" className="font-bold">
                                   Kategori *
                              </label>
                              <select
                                   id="category"
                                   className="mt-2"
                                   {...register("category", { required: true })}
                                   disabled={loading}
                              >
                                   <option value="" selected disabled>-- Pilih Kategori --</option>
                                   {categories?.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                   ))}
                              </select>
                              {errors.category && errors.category.type === "required" && (
                                   <span className="flex text-sm text-red-error">Category required</span>
                              )}
                         </div>

                         <div className="mb-2">
                              <label htmlFor="merk" className="font-bold">
                                   Judul Iklan *
                              </label>
                              <input
                                   type="text"
                                   id="merk"
                                   className="mt-2"
                                   disabled={loading}
                                   {...register("title", { required: true, minLength: 10 })}
                              />
                              {errors.title && errors.title.type === "required" && (
                                   <span className="text-sm text-red-error">Title required</span>
                              )}
                              {errors.title && errors.title.type === "minLength" && (
                                   <span className="text-sm text-red-error">
                                        Title min 10 characters
                                   </span>
                              )}
                         </div>
                         <div className="mb-2">
                              <label htmlFor="deskripsiIklan" className="font-bold">
                                   Deskripsi Iklan *
                              </label>
                              <textarea
                                   id="deskripsiIklan"
                                   cols="0"
                                   rows="4"
                                   className="mt-2"
                                   disabled={loading}
                                   {...register("description", { required: true, minLength: 30 })}
                              ></textarea>
                              {errors.description && errors.description.type === "required" && (
                                   <span className="text-sm text-red-error">
                                        Description required
                                   </span>
                              )}
                              {errors.description && errors.description.type === "minLength" && (
                                   <span className="text-sm text-red-error">
                                        Description min 30 characters
                                   </span>
                              )}
                         </div>

                         <hr className="w-[260px] mt-5" />
                         <h3 className="font-bold my-4">PASANG HARGA</h3>
                         <div className="mb-2">
                              <label htmlFor="harga" className="font-bold">
                                   Harga *
                              </label>
                              <input
                                   type="number"
                                   id="harga"
                                   className="mt-2"
                                   disabled={loading}
                                   {...register("price", { required: true, minLength: 5 })}
                              />
                              {errors.price && errors.price.type === "required" && (
                                   <span className="text-sm text-red-error">Price required</span>
                              )}
                              {errors.price && errors.price.type === "minLength" && (
                                   <span className="text-sm text-red-error">
                                        Price min 5 numbers
                                   </span>
                              )}
                         </div>
                         <hr className="w-[260px] mt-5" />
                    </div>

                    <div className="w-1/2">
                         <div className="mb-2 sm:mx-8 md:mx-8 lg:mx-8">
                              <label htmlFor="foto" className="font-bold">
                                   UNGGAH FOTO
                              </label><br />
                              <ImageUploading
                                   multiple
                                   value={images}
                                   onChange={onChange}
                                   dataURLKey="dataURL"
                                   acceptType={["png", "jpg", "jpeg"]}
                              >
                                   {({ imageList, onImageUpload, onImageRemove }) => (
                                        <div className="grid grid-cols-3 mr-0 sm:mr-60 mt-2 gap-4">
                                             {imageList?.map((image, index) => (
                                                  <div
                                                       key={index}
                                                       className="relative cursor-pointer border-2 border-gray-300 rounded-lg"
                                                  >
                                                       <img
                                                            src={image.dataURL}
                                                            alt={`Preview-${index}`}
                                                            className="object-cover h-full w-full flex justify-center items-center rounded-lg"
                                                            onClick={() => openModal(index)}
                                                       />

                                                       <div className="flex justify-center items-center">
                                                            <span
                                                                 className="text-red-500 bg-gray-300 rounded-full absolute -right-2 -top-2 sm:-right-2 sm:-top-2 md:-right-2 md:-top-2 flex justify-center items-center w-5 h-5"
                                                                 title="Hapus"
                                                                 onClick={() => onImageRemove(index)}
                                                            >
                                                                 <FaTimes />
                                                            </span>
                                                       </div>
                                                  </div>
                                             ))}
                                             <label
                                                  onClick={onImageUpload}
                                                  className="relative p-5 cursor-pointer border-2 border-gray-300 rounded-lg"
                                                  {...register("photo", { required: imageList.length === 0 })}
                                             >
                                                  <FaPlus className="text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black" />
                                             </label>

                                        </div>
                                   )}
                              </ImageUploading>
                              {errors.photo && errors.photo.type === "required" && (
                                   <span className="text-sm text-red-error">Photo required</span>
                              )}
                              <div className="mt-6">
                                   {loading ?
                                        <Spinner />
                                        :
                                        <button
                                             type="submit"
                                             className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium text-sm px-3 py-2.5 mr-2 mb-2"
                                        >
                                             JUAL SEKARANG
                                        </button>
                                   }
                              </div>

                              <Modal
                                   isOpen={modalIsOpen}
                                   onRequestClose={closeModal}
                                   contentLabel="Gambar Detail"
                              >
                                   <div className="flex justify-end">
                                        <span onClick={closeModal} className="flex cursor-pointer">
                                             <FaTimes title="Close" />
                                        </span>
                                   </div>
                                   {selectedImage !== null && (
                                        <img
                                             src={images[selectedImage].dataURL}
                                             alt={`Detail-${selectedImage}`}
                                             className="mx-auto w-full h-full object-contain"
                                        />
                                   )}
                              </Modal>

                         </div>
                    </div>
                    <ToastContainer />
               </form>
          </div>
     );
};

export default FormUsedCars

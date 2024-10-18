import { db } from "../../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CustomImage from "../../../../assets/assetmanage/Iconrarzip.svg";
import IconDollar from "../../../../assets/assetWeb/iconDollarLight.svg";
import IconCart from "../../../../assets/assetWeb/iconCart.svg";
import { Link } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";

export function MapAssetAudio() {
  const [audiosData, setAudiosData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedAudios, setLikedAudios] = useState(new Set());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [alertLikes, setAlertLikes] = useState(false);

  // Fetch the current user ID (if available)
  useEffect(() => {
    const fetchCurrentUserId = () => {
      const auth = getAuth();
      auth.onAuthStateChanged((user) => {
        if (user) {
          setCurrentUserId(user.uid);
        }
      });
    };

    fetchCurrentUserId();
  }, []);

  // Fetch audio data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "assetAudios"),
      async (snapshot) => {
        const audios = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter audios with price defined and not zero
        const filteredAudios = audios.filter(
          (audio) => audio.price !== undefined && audio.price !== 0
        );
        setAudiosData(filteredAudios);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch user likes if logged in
  useEffect(() => {
    const fetchUserLikes = async () => {
      if (!currentUserId) return;

      const likesSnapshot = await getDocs(collection(db, "likes"));
      const userLikes = new Set();

      likesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.userId === currentUserId) {
          userLikes.add(data.productId);
        }
      });

      setLikedAudios(userLikes);
    };

    fetchUserLikes();
  }, [currentUserId]);

  // Handle like/unlike functionality
  const handleLikeClick = async (audioId, currentLikes) => {
    if (!currentUserId) {
      setAlertLikes("Anda perlu login untuk menyukai Asset ini");
      setTimeout(() => {
        setAlertLikes(false);
      }, 3000);
      return;
    }

    const audioRef = doc(db, "assetAudios", audioId); // Reference to assetAudios collection

    try {
      if (likedAudios.has(audioId)) {
        await deleteDoc(doc(db, "likes", `${currentUserId}_${audioId}`));
        const newLikesAsset = Math.max(0, currentLikes - 1);
        await updateDoc(audioRef, {
          likeAsset: newLikesAsset,
        });
        likedAudios.delete(audioId);
      } else {
        await setDoc(doc(db, "likes", `${currentUserId}_${audioId}`), {
          userId: currentUserId,
          productId: audioId,
        });
        const newLikesAsset = currentLikes + 1;
        await updateDoc(audioRef, {
          likeAsset: newLikesAsset,
        });

        likedAudios.add(audioId);
      }

      setLikedAudios(new Set(likedAudios));
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  // Open modal for audio details
  const openModal = (audio) => {
    setSelectedAudio(audio);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAudio(null);
  };

  return (
    <div className="dark:bg-neutral-20 text-neutral-10 dark:text-neutral-90 min-h-screen font-poppins bg-primary-100 ">
      <div className="w-full shadow-md bg-primary-100 dark:text-primary-100 relative z-40 ">
      </div>

      <div className="pt-[100px] w-full p-12 mx-auto">
        {alertLikes && (
          <div className="alert flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md animate-fade-in">
            <AiOutlineInfoCircle className="w-6 h-6 mr-2" />
            <span className="block sm:inline">{alertLikes}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setAlertLikes(false)}>
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path d="M14.348 14.849a1 1 0 01-1.415 0L10 11.414 6.707 14.707a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586l3.293-3.293a1 1 0 011.414 1.414L11.414 10l3.293 3.293a1 1 0 010 1.415z" />
              </svg>
            </button>
          </div>
        )}
        <h1 className="text-2xl font-semibold text-neutral-10 dark:text-primary-100  mt-8">
          All Audio Categories
        </h1>
      </div>
      <div className="pt-[10px] w-full p-14">
        {/* Body section */}
        <div className="container mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-5 md:gap-5 place-items-center">
          {audiosData.map((data) => {
            const likesAsset = data.likeAsset || 0;
            const likedByCurrentUser = likedAudios.has(data.id);
            return (
              <div
                key={data.id}
                className="w-[140px] h-[155px] ssm:w-[165px] ssm:h-[180px] sm:w-[180px] sm:h-[205px] md:w-[180px] md:h-[215px] lg:w-[260px] lg:h-[295px] rounded-[10px] shadow-md bg-primary-100 dark:bg-neutral-25 group ">
                {/* image section */}
                <div className="w-[140px] h-[73px] ssm:w-[165px] ssm:h-[98px] sm:w-[180px] sm:h-[113px] md:w-[180px] md:h-[95px] lg:w-[260px] lg:h-[183px]">
                  <img
                    src={data.assetAudiosImage || CustomImage}
                    alt="Audio Image"
                    className="h-full w-full overflow-hidden relative rounded-t-[10px] mx-auto border-none max-h-full cursor-pointer"
                    onClick={() => openModal(data)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = CustomImage;
                    }}
                  />
                </div>

                {/* details section */}
                <div className="flex-col justify-start px-4 py-2 sm:p-4">
                  <p className="text-[9px] text-neutral-20 font-light dark:text-primary-100">
                    {data.assetAudiosName}
                  </p>
                  <h4 className="text-neutral-10 text-[9px] ssm:text-[11px] sm:text-[10px] md:text-[12px] lg:text-[14px] font-semibold dark:text-primary-100">
                    {data.description}
                  </h4>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleLikeClick(data.id, likesAsset)}
                      className="flex justify-start items-center mr-2">
                      {likedByCurrentUser ? (
                        <FaHeart className="text-red-600" />
                      ) : (
                        <FaRegHeart className="text-neutral-10 text-[11px] sm:text-[14px] dark:text-primary-100 " />
                      )}
                      <p className="ml-2 text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                        ({likesAsset})
                      </p>
                    </button>
                    <p className="flex justify-end w-full text-[8px] sm:text-[11px] md:text-[11px] lg:text-[15px]">
                      Rp. {data.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for audio details */}
      {modalIsOpen && selectedAudio && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-neutral-10 bg-opacity-50"></div>
          <div className="bg-primary-100 dark:bg-neutral-20 p-6 rounded-lg z-50 w-[700px] sm:w-[700px] md:w-[700px] lg:w-[700px] xl:w-[700px] 2xl:w-[700px]  mx-4 flex relative">
            <button
              className="absolute top-1 sm:top-2 md:top-2 lg:top-3 xl:top-2 2xl:top-2 right-3 sm:right-2 md:right-2 lg:right-3 xl:right-2 2xl:right-2 text-gray-600 dark:text-gray-400 text-2xl sm:text-xl md:text-xl lg:text-[35px] xl:text-[40px] 2xl:text-2xl"
              onClick={closeModal}>
              &times;
            </button>
            <img
              src={selectedAudio.assetAudiosImage || CustomImage}
              alt="Audio Image"
              className="w-1/2 h-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = CustomImage;
              }}
            />
            <div className="w-1/2 pl-4 ">
              <h2 className="text-lg font-semibold mb-2 dark:text-primary-100">
                {selectedAudio.assetAudiosName}
              </h2>
              <p className="text-sm mb-2 dark:text-primary-100 mt-4">
                Rp. {selectedAudio.price.toLocaleString("id-ID")}
              </p>
              <div className="text-sm mb-2 dark:text-primary-100 mt-4">
                <label className="flex-col mt-2">Deskripsi:</label>
                <div className="mt-2">{selectedAudio.description}</div>
              </div>

              <p className="text-sm mb-2 dark:text-primary-100 mt-4">
                Kategori: {selectedAudio.category}
              </p>
              <Link
                to="/"
                className="flex p-2 text-center items-center justify-center bg-neutral-60 w-48 sm:w-[250px] md:w-[250px] lg:w-[300px] xl:w-[300px] 2xl:w-[300px] h-10 mt-10 rounded-md">
                <img src={IconCart} alt="Cart Icon" className="w-6 h-6 mr-2" />
                <p>Tambahkan Ke Keranjang</p>
              </Link>
              <Link
                to="/"
                className="flex p-2 text-center items-center justify-center bg-secondary-40 text-primary-100 w-48 sm:w-[250px] md:w-[250px] lg:w-[300px] xl:w-[300px] 2xl:w-[300px] h-10 mt-6 rounded-md">
                <img
                  src={IconDollar}
                  alt="Cart Icon"
                  className="w-6 h-6 mr-2 -ml-24"
                />
                <p>Beli Sekarang</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

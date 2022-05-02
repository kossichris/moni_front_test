import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { baseServerURL } from "../helper/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const token = localStorage.getItem("userMoniToken");

export default function Home() {
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [userConnected, setUserConnected] = useState({});
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [userTo, setUserTo] = useState("");

  const [wallet, setWallet] = useState({
    name: "",
    balance: 0,
  });

  useEffect(async () => {
    let response = await axios.get(baseServerURL + "/user", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (response.data.user) {
      setUserConnected(response.data.user);
      setWallet((prevWalletData) => {
        return {
          ...prevWalletData,
          name: response.data.user.wallet.name,
          balance: response.data.user.wallet.balance,
        };
      });
    }

    let responseUsers = await axios.get(baseServerURL + "/users", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    setUsers(responseUsers.data);
  }, []);

  async function fundWallet(e) {
    e.preventDefault();
    const account = {
      name: wallet.name,
      balance: parseFloat(wallet.balance),
    };
    if (account.balance > 0) {
      let response = await axios.post(
        baseServerURL + "/wallet/fund",
        { wallet: account },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.data) {
        notify("Wallet funded");
        let response = await axios.get(baseServerURL + "/user", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUserConnected(response.data.user);
      }
    }
  }

  const transferMoney = async (data) => {
    let response = await axios.post(
      baseServerURL + `/wallet/${recipientId}/transfer`,
      { wallet: { amount: parseFloat(data.amount) } },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    if (response.data) {
      notify("Transfer done");
      setUserTo("");
    }
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setWallet((prevWalletData) => {
      return {
        ...prevWalletData,
        [name]: parseFloat(value),
      };
    });
  }

  const notify = (message) => toast(message);

  return (
    <section className="dashboard--section">
      <div className="form_wrapper profile">
        <div className="user--avatar">
          {" "}
          {userConnected?.username?.charAt(0)}{" "}
        </div>
        <h4 className="user--name"> {userConnected?.username} </h4>
        <div> {userConnected?.email} </div>

        <label
          onClick={() => {
            localStorage.removeItem("userMoniToken");
            window.open("/login");
          }}
          className="btn btn--apply btn--primary logout--btn"
          htmlFor="modal-1"
        >
          LOGOUT
        </label>
      </div>

      <div className="form_wrapper dashboard">
        <svg
          width="162"
          height="66"
          viewBox="0 0 162 66"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M60.2969 46.2191V25.9517H64.9137L65.3632 28.6894C66.0216 27.705 66.9125 26.8982 67.9572 26.3405C69.1097 25.7366 70.3963 25.4343 71.6972 25.4617C74.8291 25.4617 77.0491 26.6766 78.3572 29.1065C79.1002 27.9819 80.1205 27.0676 81.3196 26.4519C82.5725 25.7941 83.9687 25.4567 85.3836 25.4698C88.0268 25.4698 90.0565 26.2602 91.4726 27.841C92.8887 29.4217 93.5967 31.7369 93.5967 34.7864V46.2272H88.3664V35.2684C88.3664 33.5256 88.0329 32.1912 87.366 31.2651C86.6992 30.339 85.6712 29.8753 84.2821 29.874C82.8646 29.874 81.7273 30.3917 80.8701 31.4271C80.0129 32.4625 79.5829 33.9063 79.5802 35.7584V46.2191H74.3519V35.2684C74.3519 33.5256 74.0144 32.1912 73.3394 31.2651C72.6644 30.339 71.6155 29.8753 70.1927 29.874C69.5493 29.8553 68.9103 29.9859 68.3258 30.2553C67.7412 30.5247 67.2269 30.9258 66.8232 31.4271C65.9673 32.4638 65.5387 33.9076 65.5374 35.7584V46.2191H60.2969Z"
            fill="black"
          />
          <path
            d="M106.085 46.7064C104.233 46.7348 102.407 46.27 100.794 45.3598C99.2397 44.4713 97.9551 43.179 97.0759 41.6198C96.1633 40.0268 95.707 38.1814 95.707 36.0836C95.707 33.9858 96.1701 32.1404 97.0961 30.5475C97.9875 28.9891 99.2804 27.6983 100.84 26.8095C102.456 25.9247 104.269 25.4609 106.111 25.4609C107.953 25.4609 109.766 25.9247 111.382 26.8095C112.936 27.6969 114.221 28.9887 115.1 30.5475C116.011 32.1404 116.467 33.9858 116.469 36.0836C116.47 38.1814 116.014 40.0268 115.1 41.6198C114.217 43.1839 112.924 44.4771 111.36 45.3598C109.751 46.2661 107.931 46.7306 106.085 46.7064V46.7064ZM106.085 42.1726C106.751 42.1756 107.411 42.041 108.023 41.7772C108.634 41.5135 109.185 41.1262 109.641 40.6397C110.649 39.6191 111.153 38.1004 111.153 36.0836C111.153 34.0668 110.649 32.5481 109.641 31.5275C108.632 30.507 107.461 29.9967 106.127 29.9967C105.458 29.9893 104.794 30.1216 104.178 30.3851C103.562 30.6487 103.008 31.0378 102.551 31.5275C101.556 32.5495 101.06 34.0681 101.061 36.0836C101.062 38.0991 101.559 39.6178 102.551 40.6397C103.001 41.1267 103.548 41.5145 104.157 41.7784C104.765 42.0423 105.422 42.1766 106.085 42.1726V42.1726Z"
            fill="black"
          />
          <path
            d="M118.576 46.2184V25.951H123.195L123.6 29.3832C124.22 28.1941 125.161 27.2033 126.317 26.524C127.501 25.8153 128.897 25.4609 130.505 25.4609C133.012 25.4609 134.96 26.2513 136.349 27.8321C137.738 29.4129 138.433 31.7281 138.433 34.7776V46.2184H133.204V35.2676C133.204 33.5249 132.851 32.1904 132.143 31.2644C131.436 30.3383 130.332 29.8746 128.832 29.8732C128.153 29.8531 127.477 29.9817 126.852 30.25C126.228 30.5182 125.669 30.9197 125.216 31.4264C124.271 32.4631 123.798 33.9069 123.798 35.7577V46.2184H118.576Z"
            fill="black"
          />
          <path
            d="M143.66 22.8065C142.795 22.8384 141.952 22.5302 141.311 21.9479C141.012 21.6737 140.775 21.3383 140.616 20.9645C140.457 20.5907 140.381 20.1872 140.392 19.7813C140.38 19.3785 140.456 18.9781 140.615 18.6078C140.774 18.2375 141.011 17.9062 141.311 17.6369C141.974 17.0949 142.804 16.7988 143.661 16.7988C144.518 16.7988 145.348 17.0949 146.011 17.6369C146.311 17.9062 146.548 18.2375 146.707 18.6078C146.866 18.9781 146.942 19.3785 146.93 19.7813C146.941 20.1872 146.865 20.5907 146.706 20.9645C146.547 21.3383 146.31 21.6737 146.011 21.9479C145.37 22.5303 144.526 22.8385 143.66 22.8065ZM141.046 46.2187V25.9512H146.276V46.2187H141.046Z"
            fill="black"
          />
          <path
            d="M18.8323 36.3408L18.7736 36.2922C17.4188 35.1834 15.6818 34.6526 13.9385 34.8148C12.1953 34.977 10.586 35.8191 9.45898 37.1589L14.495 41.3747L14.5537 41.4233C15.9085 42.5322 17.6455 43.063 19.3888 42.9008C21.132 42.7386 22.7413 41.8965 23.8683 40.5567L18.8323 36.3408Z"
            fill="#E15341"
          />
          <path
            d="M20.9999 28.9581L20.9857 28.8832C20.6598 27.1638 19.6692 25.6421 18.2288 24.6482C16.7884 23.6543 15.0142 23.2683 13.291 23.5739L14.4331 30.0354L14.4452 30.1103C14.7716 31.8295 15.7623 33.3509 17.2026 34.3447C18.6429 35.3385 20.4168 35.7247 22.1399 35.4197L20.9999 28.9581Z"
            fill="#E15341"
          />
          <path
            d="M27.4131 24.7042L27.4516 24.6394C28.3095 23.1167 28.5312 21.3169 28.0686 19.6315C27.6059 17.9462 26.4963 16.5118 24.9812 15.6406L21.6927 21.3226L21.6542 21.3874C20.7963 22.91 20.5746 24.7099 21.0373 26.3952C21.4999 28.0805 22.6096 29.5149 24.1246 30.3861L27.4131 24.7042Z"
            fill="#E15341"
          />
          <path
            d="M35.0686 25.5584L35.1415 25.5321C36.7786 24.919 38.1074 23.6843 38.8389 22.0965C39.5704 20.5088 39.6454 18.6965 39.0475 17.0537L32.8655 19.2953L32.8047 19.3317C31.1676 19.9448 29.8389 21.1796 29.1078 22.7674C28.3766 24.3553 28.3022 26.1676 28.9007 27.8101L35.0686 25.5584Z"
            fill="#E15341"
          />
          <path
            d="M40.3812 31.1204L40.4521 31.1467C42.1027 31.7268 43.9154 31.6334 45.4976 30.8868C47.0799 30.1402 48.3044 28.8005 48.9062 27.1576V27.1576L42.7261 24.91L42.6552 24.8857C41.0046 24.3051 39.1918 24.3982 37.6094 25.1449C36.0269 25.8915 34.8025 27.2316 34.2012 28.8748V28.8748L40.3812 31.1204Z"
            fill="#E15341"
          />
          <path
            d="M40.8666 38.7915L40.9051 38.8563C41.8004 40.3602 43.2516 41.4514 44.9449 41.894C46.6383 42.3365 48.4378 42.0949 49.9545 41.2214L46.666 35.5314L46.6275 35.4666C45.7329 33.9618 44.2817 32.87 42.5881 32.4273C40.8944 31.9847 39.0945 32.2269 37.5781 33.1015V33.1015L40.8666 38.7915Z"
            fill="#E15341"
          />
          <path
            d="M36.2991 44.9772L36.285 45.0521C36.0017 46.7774 36.4107 48.5448 37.423 49.9704C38.4353 51.396 39.9692 52.3646 41.6915 52.6658V52.6658L42.8335 46.2043L42.8477 46.1293C43.131 44.404 42.722 42.6366 41.7097 41.211C40.6974 39.7854 39.1635 38.8168 37.4412 38.5156V38.5156L36.2991 44.9772Z"
            fill="#E15341"
          />
          <path
            d="M28.8133 46.7852L28.7546 46.8338C27.4263 47.9699 26.6008 49.5848 26.4578 51.3269C26.3148 53.0689 26.8659 54.7968 27.9912 56.1343V56.1343L33.0292 51.9164L33.0859 51.8678C34.4136 50.7317 35.2387 49.1172 35.3817 47.3757C35.5247 45.6342 34.9739 43.9067 33.8493 42.5693V42.5693L28.8133 46.7852Z"
            fill="#E15341"
          />
          <path
            d="M21.9116 43.3721H21.8367C20.088 43.3897 18.4168 44.096 17.1856 45.3379C15.9543 46.5797 15.2623 48.2569 15.2598 50.0057H21.9116C23.6603 49.9881 25.3315 49.2818 26.5628 48.0399C27.794 46.7981 28.486 45.1208 28.4886 43.3721H21.9116Z"
            fill="#E15341"
          />
        </svg>
        <h4 className="form--title">My wallet</h4>
        <div className="infos--wrapper">
          <div className="infos--panel">
            <span>
              <label>Name</label>
              <strong> {wallet?.name} </strong>
            </span>
            <span>
              <label>Balance</label>
              <strong> ₦ {userConnected?.wallet?.balance} </strong>
            </span>
          </div>
        </div>
        <form className="form form--dashboard btn--wrapper">
          <fieldset className="fieldset">
            <input
              id="balance"
              name="balance"
              className="form-control amount"
              defaultValue={wallet.balance}
              onChange={handleChange}
              placeholder="Enter amount"
              type="number"
            />
            {errors.salary && <p>{errors.salary.message}</p>}
          </fieldset>
          <button
            onClick={fundWallet}
            type="submit"
            className="btn btn--apply btn--primary"
            htmlFor="modal-1"
          >
            FUND MY WALLET
          </button>
        </form>
        <div className="divider"> </div>
        <h2> Transfer Money to </h2>
        {userTo && (
          <span className="text--transfer">
            {" "}
            <h2> {userTo} </h2>{" "}
          </span>
        )}

        {userTo && (
          <form
            className="form form--modal"
            onSubmit={handleSubmit(transferMoney)}
          >
            <fieldset className="transfer">
              <input
                className="form-control"
                {...register("amount", {
                  required: "Please enter amount",
                })}
                placeholder="Amount to send"
                type="number"
              />
              {errors.amount && <p>{errors.amount.message}</p>}
            </fieldset>
            <button className="btn btn-transfer">SEND</button>
          </form>
        )}
        <h3 className="users--list-text"> USERS </h3>
        {users?.length === 0 && (
          <div className="users--list-text"> No user </div>
        )}

        <div className="list--wrapper-general">
          <div className="list--wrapper">
            {users.map((user) => (
              <div
                onClick={() => setRecipientId(user?.id)}
                className="list--item"
              >
                <strong>{user.username.toUpperCase()}</strong>
                <label
                  onClick={() => setUserTo(user.username)}
                  className="btn btn--apply btn--primary transfer--btn"
                  htmlFor="modal-1"
                >
                  TRANSFER
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}

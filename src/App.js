import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import teamMember from './images/teamMember.png';
// react slick
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import AOS from 'aos';
import 'aos/dist/aos.css';


const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

function App() {
  const [Myaddress, SET_Myaddress] = useState("")
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 2) {
      newMintAmount = 2;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();

    document.querySelector('.ws-prev').onclick = () => {
      document.querySelector('.slick-prev').click()
    }
    document.querySelector('.ws-next').onclick = () => {
      document.querySelector('.slick-next').click()
    }

  }, [blockchain.account]);


  const getadd = async () => {

    const { ethereum } = window;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    SET_Myaddress(accounts);
  }



  const settings = {
    centerMode: true,
    centerPadding: '0px',
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }]
  };


  const [modal1, setmodal1] = useState(0)

  AOS.init({
    duration: 1500
  });


  return (

    <>
      {/* {modal1 == 1 &&
        <div className="modal-1">
          <div className="inner">
            <div className="modal-head">
              <span onClick={() => setmodal1(0)}>X</span>
            </div>
            <div className="p-3 d-flex justify-content-center align-items-center flex-column">
              <h5 className="">Roadmap</h5>
              <div className="d-flex justify-content-center flex-column align-items-center" data-aos="zoom-in" style={{ marginTop: "170px" }}>
                <p>10%</p>
                <p>
                  sold At 10% sales, we giveaway 2 Legendary series NFTs to random holders of the Late Night Club.
                </p>
              </div>

              <div className="d-flex justify-content-center flex-column align-items-center" style={{ marginTop: "170px" }}>
                <p>
                  30%
                </p>
                <p>
                  sold -At 30% sales, our exclusive Verified Owners Discord channel will open.
                </p>
              </div>

              <div className="d-flex justify-content-center flex-column align-items-center" style={{ marginTop: "170px" }}>
                <p>
                  40%
                </p>
                <p>sold -At 40% percent sold, we open our holders-only physical merch store.
                </p>
              </div>

              <div className="d-flex justify-content-center flex-column align-items-center" style={{ marginTop: "170px" }}>
                <p>
                  50%
                  <p>
                    sold -At 50% we will host a donation poll for the Verified Owners channel to decide on a charity to which we will donate ETH.
                  </p>
                </p>
              </div>

              <div className="d-flex justify-content-center flex-column align-items-center" style={{ marginTop: "170px" }}>
                <p>
                  60%
                </p>
                <p> sold -At 60% sales, holders will receive a bottle of NOS2 to be used in the Workshop and future releases and collaborations.
                </p>
              </div>

              <div className="d-flex justify-content-center flex-column align-items-center" style={{ marginTop: "170px", marginBottom: "150px" }}>
                <p>
                  60%
                </p>
                <p>sold -At 60% sales, holders will receive a bottle of NOS2 to be used in the Workshop and future releases and collaborations.
                </p>
              </div>
            </div>
          </div>
        </div>

      } */}

      <div className="main">

        <nav className="d-flex  px-lg-5 px-2 align-items-center justify-content-between ">
          <div className="d-flex align-items-center col justify-content-lg-start justify-content-around">
            <a href="#about" style={{ textDecoration: "none" }}><span className="px-lg-4 px-0 py-4">About</span></a>
            {/* <span className="px-lg-4 px-0 py-4" onClick={() => setmodal1(1)}>Roadmap</span> */}
            <a href="#roadmap" style={{ textDecoration: "none" }}><span className="px-lg-4 px-0 py-4">Roadmap</span></a>
            <a href="#founder" style={{ textDecoration: "none" }}><span className="px-lg-4 px-0 py-4">Founders</span></a>
          </div>
          <div className="d-flex align-items-center col justify-content-lg-end justify-content-around">
            <span className="px-lg-4 px-0 py-4 addplace"
              onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                getData();
                getadd();
              }}
            >{Myaddress ? <> {Myaddress} <span className="dot">..</span>  </> : "Connect MetaMask "} </span>
            <span className="px-lg-4 px-0 py-4"
              onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                getData();
              }}>Buy NFT</span>
          </div>
        </nav>

        <div className="d-flex justify-content-center">
          <img src="config/images/logo.png" className="logo" alt="" />
        </div>


        <Slider {...settings} className="car-slider">
          <div className="car-slide">
            <img src="config/images/car-1.png" alt="" />
          </div>
          <div className="car-slide">
            <img src="config/images/car-2.png" alt="" />
          </div>
          <div className="car-slide">
            <img src="config/images/car-3.png" alt="" />
          </div>
          <div className="car-slide">
            <img src="config/images/car-4.png" alt="" />
          </div>
          <div className="car-slide">
            <img src="config/images/car-1.png" alt="" />
          </div>
          <div className="car-slide">
            <img src="config/images/car-2.png" alt="" />
          </div>
          <div className="car-slide">
            <img src="config/images/car-3.png" alt="" />
          </div>
          <div className="car-slide">
            <img src="config/images/car-4.png" alt="" />
          </div>
        </Slider>

        <div className="d-flex w-100 align-items-center justify-content-center ws-controls">
          <img src="config/images/left.png" className="ws-arrow ws-prev " alt="" />
          <img src="config/images/button.png" className="ws-btn mx-3"
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
              getData();
            }}
            alt="" />
          <img src="config/images/right.png" className="ws-arrow ws-next " alt="" />
        </div>
        <div className="d-flex w-100 align-items-center justify-content-center flex-column fw-500 py-4">
          <small className="text-center px-3">Legendary collection (2000 UNIQUES)</small>
        </div>

      </div>

      {/* roadmap */}
      <div id="roadmap" className="roadmap_p">
        <div className="mob_road">
          <div className="road_content1 px-5" data-aos="fade-down">
            <h5 className="mt-5 pt-5">Roadmap</h5>
            <div className="d-flex justify-content-center flex-column align-items-center text-center" data-aos="zoom-in" style={{ marginTop: "80px" }}>
              <p>10% sold</p>
              <p>
                At 10% sales, we giveaway 2 Legendary series NFTs to random holders of the Late Night Club.
              </p>
            </div>
          </div>
          <div className="road_content2 px-5" data-aos="fade-down">
            <div className="d-flex justify-content-center flex-column align-items-center text-center" data-aos="zoom-in" style={{ marginTop: "30px" }}>
              <p>
                30% sold
              </p>
              <p>
                -At 30% sales, our exclusive Verified Owners Discord channel will open.
              </p>
            </div>
            <div className="d-flex justify-content-center flex-column align-items-center text-center" data-aos="zoom-in" style={{ marginTop: "30px" }}>
              <p>
                40%% sold
              </p>
              <p>-At 40% percent sold, we open our holders-only physical merch store.
              </p>
            </div>
          </div>
          <div className="road_content3 px-5" data-aos="fade-down">
            <div className="d-flex justify-content-center flex-column align-items-center text-center" data-aos="zoom-in" style={{ marginTop: "30px" }}>
              <p>
                50% sold
                <p className="mt-3">
                  -At 50% we will host a donation poll for the Verified Owners channel to decide on a charity to which we will donate ETH.
                </p>
              </p>
            </div>
            <div className="d-flex justify-content-center flex-column align-items-center text-center" data-aos="zoom-in" style={{ marginTop: "30px" }}>
              <p>
                60% sold
              </p>
              <p> -At 60% sales, holders will receive a bottle of NOS2 to be used in the Workshop and future releases and collaborations
              </p>
            </div>
          </div>
          <div className="road_content4 px-5" data-aos="fade-down">
            <div className="d-flex justify-content-center flex-column align-items-center text-center" data-aos="zoom-in" style={{ marginTop: "30px" }}>
              <p>
                70%
                <p className="mt-3">
                  At 70% sales, we release our $TURBO utility token with staking capabilities.
                </p>
              </p>
            </div>
            <div className="d-flex justify-content-center flex-column align-items-center text-center" data-aos="zoom-in" style={{ marginTop: "30px" }}>
              <p>
                80%
              </p>
              <p>-Workshop initiated.
                You can now upgrade and modify your NFT using our $TURBO utility token.
              </p>
            </div>
          </div>
          <div className="road_content5 px-5" data-aos="fade-down">
            <div className="d-flex justify-content-center flex-column align-items-center text-center" data-aos="zoom-in" style={{ marginTop: "30px" }}>
              <p>
                90%
                <p className="mt-3">
                  -At 90% the party everyone’s been waiting for - the best party in town for holders only in which we will host a giveaway of limited edition merch, NFTs, and other gifts.
                </p>
              </p>
            </div>
            <div className="d-flex justify-content-center flex-column align-items-center text-center" data-aos="zoom-in" style={{ marginTop: "30px" }}>
              <p>
                100%
              </p>
              <p>-Welcome to the Metaverse! We now have our own parking lot for exclusive car events and and a members-only Night Club in which you can stay updated about the latest car related events and news, holders-only surprises, and more.
              </p>
            </div>
          </div>
        </div>
        <div className="road_content6 px-5" data-aos="fade-down">
          <div className="d-flex justify-content-center flex-column align-items-center text-center" data-aos="zoom-in" style={{ marginTop: "30px", paddingBottom: "60px" }}>
            <p>
              -Aftersale
            </p>
            <p>Our mini game will launch where you can play and race with your own modified NFT car against other owners. Win and earn rewards such as rare and unique modifications that will boost your rarity scores.
            </p>
          </div>
        </div>
      </div>

      {/* about */}
      <div id="about" className="about px-5">
        <h5 className="my-5" data-aos="flip-left">About</h5>
        <p className="text-start" data-aos="flip-left">The Late Night Club is a groundbreaking art project.</p>
        <p className="text-start mb-5" data-aos="flip-left">For the first time on the ETH blockchain, we combined our passion for cars and technology to create the essence of the car community.</p>
        <p className="text-start mb-5" data-aos="flip-left">For the first time ever, we bring the car community into the Metaverse.</p>
        <p className="text-start mb-5" data-aos="flip-left">Physical and digital, combined into one, our art will take your breath away even faster than a Civic with a laptop.</p>
        <p className="text-start mb-5" data-aos="flip-left">We combine our passion for state of the art technology with our love for the smell of gasoline.</p>
        <p className="text-start" data-aos="flip-left">We love car meets, late night cruises, mountain carving and car shows.</p>
        <p className="text-start mb-5" data-aos="flip-left">With car builds coming in all shapes and sizes, we tried to capture the essence of the car community in to our NFT art project. </p>
        <p className="text-start mb-5" data-aos="flip-left">We hope you love our art as much as you love the cars.</p>
        <p className="text-start mb-5" data-aos="flip-left">Stop for nothing</p>
        <p className="text-start mb-0" data-aos="flip-left">Unstopabble</p>
        <p className="text-start mb-5" data-aos="flip-left">Ecosystem</p>
        <p className="text-start" data-aos="flip-left">Utility</p>
        <div className="d-flex align-items-center justify-content-center flex-row py-4">
          <a href="#">
            <i class="fab fa-instagram text-white fs-4 mx-3"></i>
          </a>
          <a href="#">
            <i class="fab fa-twitter text-white fs-4 mx-3"></i>
          </a>
        </div>
      </div>

      {/* Founders */}
      <div id="founder" className="founders">
        <h5 className="my-5" data-aos="zoom-in">LATE NIGHT CLUB<br /><br />FOUNDERS</h5>
        <div className="team">
          <div className="members my-5">
            <img src={teamMember} alt="123" data-aos="zoom-out" />
            <p className="mt-3 mb-2" data-aos="zoom-in-down">Michel Jackson</p>
            <p className="mb-2">CEO</p>
            <h6 className="text-muted">"Lorem ipsum is placeholder text commonly used in the graphic, print publishing industries for previewing layouts and visual mockups."</h6>
          </div>
          <div className="members my-5">
            <img src={teamMember} alt="123" data-aos="zoom-out" />
            <p className="mt-3 mb-2" data-aos="zoom-in-down">ALIYAN</p>
            <p className="mb-2">Senior Developer</p>
            <h6 className="text-muted">"Lorem ipsum is placeholder text commonly used in the graphic, print publishing industries for previewing layouts and visual mockups."</h6>
          </div>
          <div className="members my-5">
            <img src={teamMember} alt="123" data-aos="zoom-out" />
            <p className="mt-3 mb-2" data-aos="zoom-in-down">JHON BLACK</p>
            <p className="mb-2">Designer</p>
            <h6 className="text-muted">"Lorem ipsum is placeholder text commonly used in the graphic, print publishing industries for previewing layouts and visual mockups."</h6>
          </div>
        </div>
      </div>


    </>


    // Privous Code 

    // <s.Screen>
    //   <s.Container
    //     flex={1}
    //     ai={"center"}
    //     style={{ padding: 24, backgroundColor: "var(--primary)" }}
    //     image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
    //   >
    //     <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
    //     <s.SpacerSmall />
    //     <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
    //       <s.Container flex={1} jc={"center"} ai={"center"}>
    //         <StyledImg alt={"example"} src={"/config/images/example.gif"} />
    //       </s.Container>
    //       <s.SpacerLarge />
    //       <s.Container
    //         flex={2}
    //         jc={"center"}
    //         ai={"center"}
    //         style={{
    //           backgroundColor: "var(--accent)",
    //           padding: 24,
    //           borderRadius: 24,
    //           border: "4px dashed var(--secondary)",
    //           boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
    //         }}
    //       >
    //         <s.TextTitle
    //           style={{
    //             textAlign: "center",
    //             fontSize: 50,
    //             fontWeight: "bold",
    //             color: "var(--accent-text)",
    //           }}
    //         >
    //           {data.totalSupply} / {CONFIG.MAX_SUPPLY}
    //         </s.TextTitle>
    //         <s.TextDescription
    //           style={{
    //             textAlign: "center",
    //             color: "var(--primary-text)",
    //           }}
    //         >
    //           <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
    //             {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
    //           </StyledLink>
    //         </s.TextDescription>
    //         <s.SpacerSmall />
    //         {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
    //           <>
    //             <s.TextTitle
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               The sale has ended.
    //             </s.TextTitle>
    //             <s.TextDescription
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               You can still find {CONFIG.NFT_NAME} on
    //             </s.TextDescription>
    //             <s.SpacerSmall />
    //             <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
    //               {CONFIG.MARKETPLACE}
    //             </StyledLink>
    //           </>
    //         ) : (
    //           <>
    //             <s.TextTitle
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
    //               {CONFIG.NETWORK.SYMBOL}.
    //             </s.TextTitle>
    //             <s.SpacerXSmall />
    //             <s.TextDescription
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               Excluding gas fees.
    //             </s.TextDescription>
    //             <s.SpacerSmall />
    //             {blockchain.account === "" ||
    //             blockchain.smartContract === null ? (
    //               <s.Container ai={"center"} jc={"center"}>
    //                 <s.TextDescription
    //                   style={{
    //                     textAlign: "center",
    //                     color: "var(--accent-text)",
    //                   }}
    //                 >
    //                   Connect to the {CONFIG.NETWORK.NAME} network
    //                 </s.TextDescription>
    //                 <s.SpacerSmall />
    //                 <StyledButton
    //                   onClick={(e) => {
    //                     e.preventDefault();
    //                     dispatch(connect());
    //                     getData();
    //                   }}
    //                 >
    //                   CONNECT
    //                 </StyledButton>
    //                 {blockchain.errorMsg !== "" ? (
    //                   <>
    //                     <s.SpacerSmall />
    //                     <s.TextDescription
    //                       style={{
    //                         textAlign: "center",
    //                         color: "var(--accent-text)",
    //                       }}
    //                     >
    //                       {blockchain.errorMsg}
    //                     </s.TextDescription>
    //                   </>
    //                 ) : null}
    //               </s.Container>
    //             ) : (
    //               <>
    //                 <s.TextDescription
    //                   style={{
    //                     textAlign: "center",
    //                     color: "var(--accent-text)",
    //                   }}
    //                 >
    //                   {feedback}
    //                 </s.TextDescription>
    //                 <s.SpacerMedium />
    //                 <s.Container ai={"center"} jc={"center"} fd={"row"}>
    //                   <StyledRoundButton
    //                     style={{ lineHeight: 0.4 }}
    //                     disabled={claimingNft ? 1 : 0}
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       decrementMintAmount();
    //                     }}
    //                   >
    //                     -
    //                   </StyledRoundButton>
    //                   <s.SpacerMedium />
    //                   <s.TextDescription
    //                     style={{
    //                       textAlign: "center",
    //                       color: "var(--accent-text)",
    //                     }}
    //                   >
    //                     {mintAmount}
    //                   </s.TextDescription>
    //                   <s.SpacerMedium />
    //                   <StyledRoundButton
    //                     disabled={claimingNft ? 1 : 0}
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       incrementMintAmount();
    //                     }}
    //                   >
    //                     +
    //                   </StyledRoundButton>
    //                 </s.Container>
    //                 <s.SpacerSmall />
    //                 <s.Container ai={"center"} jc={"center"} fd={"row"}>
    //                   <StyledButton
    //                     disabled={claimingNft ? 1 : 0}
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       claimNFTs();
    //                       getData();
    //                     }}
    //                   >
    //                     {claimingNft ? "BUSY" : "BUY"}
    //                   </StyledButton>
    //                 </s.Container>
    //               </>
    //             )}
    //           </>
    //         )}
    //         <s.SpacerMedium />
    //       </s.Container>
    //       <s.SpacerLarge />
    //       <s.Container flex={1} jc={"center"} ai={"center"}>
    //         <StyledImg
    //           alt={"example"}
    //           src={"/config/images/example.gif"}
    //           style={{ transform: "scaleX(-1)" }}
    //         />
    //       </s.Container>
    //     </ResponsiveWrapper>
    //     <s.SpacerMedium />
    //     <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
    //       <s.TextDescription
    //         style={{
    //           textAlign: "center",
    //           color: "var(--primary-text)",
    //         }}
    //       >
    //         Please make sure you are connected to the right network (
    //         {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
    //         Once you make the purchase, you cannot undo this action.
    //       </s.TextDescription>
    //       <s.SpacerSmall />
    //       <s.TextDescription
    //         style={{
    //           textAlign: "center",
    //           color: "var(--primary-text)",
    //         }}
    //       >
    //         We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
    //         successfully mint your NFT. We recommend that you don't lower the
    //         gas limit.
    //       </s.TextDescription>
    //     </s.Container>
    //   </s.Container>
    // </s.Screen>
  );
}

export default App;

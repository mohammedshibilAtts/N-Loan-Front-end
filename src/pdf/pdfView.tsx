import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiClear, apiRequest } from "../store/actions";
import API_ENDPOINTS from "../services/endpoints";

import {
  pdf,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { Button, Box } from "@mui/material";
Font.register({
  family: "Noto Sans",
  src: "https://fonts.gstatic.com/s/notosans/v27/o-0IIpQlx3QUlC5A4PNb4g.ttf",
});
// import { Print, PictureAsPdf } from "@mui/icons-material";
import Logos from "../../public/assets/images/Logo/PdfLogo.png";
import {
  // formatDecimal,
  formatNumber,
  // toNum
} from "../utils/commonFunction";
import { LOAN_ACC_PRINT_RES } from "../store/actionTypes";

// function formatDate(IsoString: Date) {
//   if (!IsoString) return "-";
//   const date = new Date(IsoString);
//   const options: any = {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   };
//   const formattedDate = date.toLocaleString("en-GB", options).replace(",", "");
//   return formattedDate;
// }

// Updated Styles for PDF document
// const styles = StyleSheet.create({
//   // page: {
//   //   padding: 39,
//   //   fontFamily: "Helvetica",
//   //   backgroundColor: "white",
//   //   fontSize: 8,
//   //   position: "relative",
//   // },
//   page: {
//     paddingLeft: 10,
//     paddingRight: 10,
//     paddingTop: 5,
//     paddingBottom: 5,
//     fontFamily: "Helvetica",
//     backgroundColor: "white",
//     fontSize: 8,
//     position: "relative",
//   },

//   sectionTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     marginBottom: 6,
//     textAlign: "center",
//   },
//   itemTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     marginTop: 5,
//     margin: 4,
//     textAlign: "left",
//   },
//   profile: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     paddingRight: 15,
//   },
//   customerDetails: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     margin: 5,
//     fontSize: 9,
//   },
//   fieldName: {
//     width: 70,
//     fontWeight: "bold",
//   },

//   fieldValue: {
//     marginLeft: 6,
//     width: "15%",
//     flexWrap: "wrap",
//   },
//   datalist: {
//     flexDirection: "row",
//     marginBottom: 8,
//   },

//   itemDetailsContainer: {
//     marginVertical: 10,
//   },

//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#09090F",
//     paddingVertical: 8,
//     paddingHorizontal: 4,
//   },

//   tableHeader: {
//     flex: 1,
//     fontSize: 9,
//     fontWeight: "bold",
//     textAlign: "left",
//     color: "#09090F",
//   },

//   tableCell: {
//     flex: 1,
//     fontSize: 11,
//     textAlign: "left",
//     color: "#09090F",
//   },

//   totalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     borderTopColor: "#09090F",
//     paddingVertical: 8,
//     paddingHorizontal: 4,
//   },

//   totalLabel: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#000",
//   },

//   totalValue: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   rupee: {
//     fontFamily: "Noto Sans",
//   },
// });

const styles = StyleSheet.create({
  page: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    fontFamily: "Helvetica",
    backgroundColor: "white",
    fontSize: 8,
    position: "relative",
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
    margin: 4,
    textAlign: "left",
  },
  profile: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
  },
  customerDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    fontSize: 9,
  },
  fieldName: {
    width: 70,
    fontWeight: "bold",
  },

  fieldValue: {
    marginLeft: 6,
    width: "15%",
    flexWrap: "wrap",
  },
  datalist: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dateList: {
    flexDirection: "row",
  },

  itemDetailsContainer: {
    marginVertical: 10,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#09090F",
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 25, // Ensure minimum height for wrapped text
  },

  tableHeader: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
  },

  tableCell: {
    fontSize: 9, // Reduced from 11 to save space
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
    flexWrap: "wrap", // Allow text wrapping
  },

  // Specific column widths to prevent overflow
  metalColumn: {
    width: "10%",
    fontSize: 9,
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
    flexWrap: "wrap",
  },

  tagColumn: {
    width: "20%",
    fontSize: 9,
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
    flexWrap: "wrap",
  },

  purityColumn: {
    width: "10%",
    fontSize: 9,
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
    flexWrap: "wrap",
  },

  itemTypeColumn: {
    width: "15%", // Wider for longer item names
    fontSize: 9,
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
    flexWrap: "wrap",
  },

  weightColumn: {
    width: "12%",
    fontSize: 9,
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
    flexWrap: "wrap",
  },

  quantityColumn: {
    width: "8%",
    fontSize: 9,
    textAlign: "center",
    color: "#09090F",
    paddingHorizontal: 2,
  },

  valueColumn: {
    width: "15%",
    fontSize: 9,
    textAlign: "right",
    color: "#09090F",
    paddingHorizontal: 2,
    flexWrap: "wrap",
  },

  // Header specific styles
  metalHeader: {
    width: "10%",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
  },

  tagHeader: {
    width: "20%",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
  },

  purityHeader: {
    width: "10%",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
  },

  itemTypeHeader: {
    width: "15%",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
  },

  weightHeader: {
    width: "12%",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "left",
    color: "#09090F",
    paddingHorizontal: 2,
  },

  quantityHeader: {
    width: "8%",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    color: "#09090F",
    paddingHorizontal: 2,
  },

  valueHeader: {
    width: "15%",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "right",
    color: "#09090F",
    paddingHorizontal: 2,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopColor: "#09090F",
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 25,
  },

  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },

  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },

  rupee: {
    fontFamily: "Noto Sans",
  },

  loanTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#09090F",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  LoanTableHeader: {
    flex: 1,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "left",
    color: "#09090F",
  },

  loanTableCell: {
    flex: 1,
    fontSize: 11,
    textAlign: "left",
    color: "#09090F",
  },

  loanTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopColor: "#09090F",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  loanTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },

  loanTotalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  loanRupee: {
    fontFamily: "Noto Sans",
  },
});

interface LoanItem {
  tagId: string;
  grossWt: number;
  netWt: number;
  quantity: number;
  metalPrice: number;
  metal?: {
    metalName: string;
  };
  purity?: {
    purityName: string;
  };
  item?: {
    itemName: string;
  };
}

interface LoanData {
  interestRate: number;
  installment: number;
  processingFee: number;
  additionalCharges: number;
  lateFine: number;
  maturityDate: string;
  branchName: string;
  loanName: string;
  Items: LoanItem[];
  customerName: string;
  customerImg: string;
  mobile: string;
  address: string;
  whatsappNo: string;
  gender: string;
  date_of_birth: string;
  panCard: string;
  aadhar_number: string;
  martialStatus: string;
  createdAt: string;
  loanNo: string;
  totalItemAmount: number;
  itemImg:string
}


const LoanPrintView = ({ data }: { data: LoanData }) => {
 
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Right strip */}
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 9,
          }}
        />

        <View>
          <View>
            <Image src={Logos} style={{ width: 102, height: 65 }} />
          </View>
        </View>

        {/* customer details */}
        <View>
          <Text style={styles.sectionTitle}>Loan Creation</Text>
          <View style={styles.profile}>
            <Image
              src={`http://localhost:8000/proxy-image?url=${encodeURIComponent(data?.customerImg)}`}
              style={{ width: 80, height: 80 }}
            />
          </View> 
          <View style={styles.customerDetails}>
            <View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Name </Text>
                <Text>:</Text>
                <Text style={styles.fieldValue}> {data?.customerName}</Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Mobile No </Text>
                <Text>:</Text>
                <Text style={styles.fieldValue}> {data?.mobile} </Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Address </Text>
                <Text>:</Text>
                <Text style={styles.fieldValue}>{data?.address}</Text>
              </View>
            </View>
            <View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Whatsapp No </Text>
                <Text style={styles.fieldValue}>: {data?.whatsappNo} </Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Gender </Text>
                <Text style={styles.fieldValue}>: {data?.martialStatus} </Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Date of Birth </Text>
                <Text style={styles.fieldValue}>
                  :{" "}
                  {new Date(data?.date_of_birth).toLocaleDateString(
                    "en-GB"
                  )}{" "}
                </Text>
              </View>
            </View>
            <View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Branch </Text>
                <Text style={styles.fieldValue}>: {data?.branchName} </Text>
              </View>
              {data?.panCard && (
                <View style={styles.datalist}>
                  <Text style={styles.fieldName}>Pan Card </Text>
                  <Text style={styles.fieldValue}>: {data?.panCard} </Text>
                </View>
              )}
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Aadhar No </Text>
                <Text style={styles.fieldValue}>: {data?.aadhar_number} </Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Marital Status </Text>
                <Text style={styles.fieldValue}>: {data?.martialStatus} </Text>
              </View>
            </View>
          </View>
        </View>

        {/* item details */}
        <View>
          <Text style={styles.itemTitle}>Item Details</Text>
          <View
            style={{
              borderTop: "1px",
              borderColor: "#09090F",
              ...styles.itemDetailsContainer,
            }}
          >
            {/* Header Row */}
            <View style={styles.tableRow}>
              <Text style={styles.metalHeader}>Metal</Text>
              <Text style={styles.tagHeader}>Tag Number</Text>
              <Text style={styles.purityHeader}>Purity</Text>
              <Text style={styles.itemTypeHeader}>Item Type</Text>
              <Text style={styles.weightHeader}>Gross WT</Text>
              <Text style={styles.weightHeader}>NET WT</Text>
              <Text style={styles.quantityHeader}>Qty</Text>
              <Text style={styles.valueHeader}>Value</Text>
            </View>

            {/* Data Rows */}
          {data?.Items&&(
               (data.Items?.map((item: any, index: any) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.metalColumn}>{item?.metal?.metalName}</Text>
                <Text style={styles.tagColumn}>{item?.tagId}</Text>
                <Text style={styles.purityColumn}>
                  {item?.purity?.purityName}
                </Text>
                <Text style={styles.itemTypeColumn}>
                  {item?.item?.itemName}
                </Text>
                <Text style={styles.weightColumn}>{item?.grossWt}</Text>
                <Text style={styles.weightColumn}>{item?.netWt}</Text>
                <Text style={styles.quantityColumn}>{item?.quantity}</Text>
                <Text style={{ ...styles.rupee, ...styles.valueColumn }}>
                  {formatNumber({ value: item?.metalPrice ?? 0 })}
                </Text>
              </View>
            )))
          )}

            {/* Total Row */}
            <View
              style={{
                borderBottom: "1px",
                borderColor: "#09090F",
                ...styles.totalRow,
              }}
            >
              <Text style={styles.metalColumn}>Total</Text>
              <Text style={styles.tagColumn}></Text>
              <Text style={styles.purityColumn}></Text>
              <Text style={styles.itemTypeColumn}></Text>
              <Text style={styles.weightColumn}></Text>
              <Text style={styles.weightColumn}></Text>
              <Text style={styles.quantityColumn}></Text>
              <Text style={{ ...styles.rupee, ...styles.valueColumn }}>
                {formatNumber({ value: data?.totalItemAmount ?? 0 })}
              </Text>
            </View>
          </View>
        </View>

        {/* loan details */}

        <View style={{ marginTop: "48px" }}>
          <View style={styles.customerDetails}>
            <View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Loan ID </Text>
                <Text style={styles.fieldValue}>: {data?.loanNo} </Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Loan Type </Text>
                <Text style={styles.fieldValue}>: {data?.loanName} </Text>
              </View>
            </View>
            <View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Loan Join Date </Text>
                <Text style={styles.fieldValue}>
                  : {new Date(data?.createdAt).toLocaleDateString("en-GB")}
                </Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Maturity Period </Text>
                <Text style={styles.fieldValue}>
                  : {new Date(data?.maturityDate).toLocaleDateString("en-GB")}
                </Text>
              </View>
            </View>
            <View>
              <View>
                <Image src={`http://localhost:8000/proxy-image?url=${encodeURIComponent(data?.itemImg)}`} style={{ width: "50px", height: "50px" }} />
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            borderTop: "1px",
            borderColor: "#09090F",
            ...styles.itemDetailsContainer,
          }}
        >
          {/* Header Row */}
          <View style={styles.loanTableRow}>
            <Text style={styles.LoanTableHeader}>Principal Amount</Text>
            <Text style={styles.LoanTableHeader}>Interest Rate</Text>
            <Text style={styles.LoanTableHeader}>Instalment </Text>
            <Text style={styles.LoanTableHeader}>Processing fee</Text>
            <Text style={styles.LoanTableHeader}>Additional Charges</Text>
            <Text style={styles.LoanTableHeader}>Late Fine</Text>
          </View>

          {/* Row 1 */}
          <View style={styles.loanTotalRow}>
            <Text style={{ ...styles.rupee, ...styles.loanTableCell }}>
              {formatNumber({ value: 1000 })}
            </Text>
            <Text style={styles.loanTableCell}>12%</Text>
            <Text style={styles.loanTableCell}>1/10</Text>
            <Text style={{ ...styles.rupee, ...styles.loanTableCell }}>
              {formatNumber({ value: 1000 })}
            </Text>
            <Text style={{ ...styles.rupee, ...styles.loanTableCell }}>
              {formatNumber({ value: 1000 })}
            </Text>
            <Text style={{ ...styles.rupee, ...styles.loanTableCell }}>
              {formatNumber({ value: 200 })}
            </Text>
          </View>
          <View style={{ borderBottom: "1px" }}></View>
        </View>
      </Page>
    </Document>
  );
};

const ViewPdf = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const iframeRef = useRef(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(true);
  const [loanData, setLoanData] = useState<any>(null);

  const { loanView } = useSelector((states: any) => ({
    loanView: states[LOAN_ACC_PRINT_RES]?.data,
  }));

  useEffect(() => {
    if (id) {
      dispatch(
        apiRequest(LOAN_ACC_PRINT_RES, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "loanPrint",
          params: {
            tableName: "loanAccount",
            procedureName: "loanPrint",
            id,
          },
        })
      );
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (loanView?.success) {
      setLoanData(loanView.data.data);
      // setIsLoading(false);
    } else if (loanView?.success === false) {
      // setIsLoading(false);
    }
  }, [loanView]);

  useEffect(() => {
    return () => {
      dispatch(apiClear(LOAN_ACC_PRINT_RES));
    };
  }, [dispatch]);

  useEffect(() => {


     if(!loanData){
      return 
     }
     generatePdf();
   

    const timer = setTimeout(() => {
      handlePrint();
    }, 2000);

    return () => clearTimeout(timer);
  }, [loanData]);

  const generatePdf = async () => {
    const blob = await pdf(<LoanPrintView data={loanData} />).toBlob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const handlePrint = () => {
    const iframe = iframeRef.current as HTMLIFrameElement | null;

    if (iframe?.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {!pdfUrl ? (
        <Button
          sx={{
            bgcolor: "black",
            color: "white",
            "&:hover": {
              bgcolor: "black",
            },
            display: "none",
          }}
          onClick={generatePdf}
        >
          Loan Creation
        </Button>
      ) : (
        <>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              sx={{
                color: "black",
                border: 1,
                "&:hover": {
                  bgcolor: "black",
                  color: "white",
                },
              }}
              onClick={() => navigate(`/manageloan/existingloan`)}
            >
              Back
            </Button>
            <Button
              sx={{
                bgcolor: "black",
                color: "white",
                "&:hover": {
                  bgcolor: "black",
                },
              }}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Box>
          <Box
            sx={{
              height: "calc(100vh - 150px)",
              backgroundColor: "white",
              "& iframe": {
                backgroundColor: "white !important",
              },
            }}
          >
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              width="100%"
              height="100%"
              style={{
                border: "none",
                backgroundColor: "white",
              }}
              
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ViewPdf;

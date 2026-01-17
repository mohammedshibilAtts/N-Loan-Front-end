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
// import Pic from "../../public/assets/images/Logo/pic.jpg";
import {
  // formatDecimal,
  formatNumber,
  // toNum
} from "../utils/commonFunction";
import { CLOSE_ACCOUNT_PRINT_RES } from "../store/actionTypes";
import { spliceDecimals } from "../const";

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
const styles = StyleSheet.create({
  // page: {
  //   padding: 39,
  //   fontFamily: "Helvetica",
  //   backgroundColor: "white",
  //   fontSize: 8,
  //   position: "relative",
  // },
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
    width: 80,
    fontWeight: "bold",
  },
  otherFieldName: {
    width: 120,
    fontWeight: "bold",
  },
  addressField: {
    width: 40,
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

  itemDetailsContainer: {
    marginVertical: 10,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#09090F",
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 5,
  },

  tableHeader: {
    flex: 1,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "left",
    color: "#09090F",
  },

  tableCell: {
    flex: 1,
    fontSize: 11,
    textAlign: "left",
    color: "#09090F",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopColor: "#09090F",
    paddingVertical: 8,
    paddingHorizontal: 4,
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
});

const DFIReport = ({ data }: any) => {
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
          <Text style={styles.sectionTitle}>Loan Closure</Text>
          <View style={styles.profile}>
        
            <Image src={`http://localhost:8000/proxy-image?url=${encodeURIComponent(data?.customerImg)}`} style={{ width: 80, height: 80 }} />
          </View>
          <View style={styles.customerDetails}>
            <View style={{ marginTop: "5px" }}>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Name </Text> <Text>:</Text>
                <Text style={styles.fieldValue}> {data?.customerName} </Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Mobile No </Text> <Text>:</Text>
                <Text style={styles.fieldValue}> {data?.mobile} </Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}>Loan Start Date </Text>{" "}
                <Text>:</Text>
                <Text style={styles.fieldValue}>
                  {" "}
                  {new Date(data?.createdAt).toLocaleDateString(
                    "en-GB"
                  )}{" "}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: "5px" }}>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}></Text>
                <Text style={styles.fieldValue}></Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}> </Text>
                <Text style={styles.fieldValue}></Text>
              </View>
              <View style={styles.datalist}>
                <Text style={styles.fieldName}> </Text>
                <Text style={styles.fieldValue}></Text>
              </View>
            </View>
            <View style={{ marginTop: "5px" }}>
              <View style={{ paddingRight: "20px", ...styles.datalist }}>
                <Text style={styles.addressField}>Address </Text>
                <Text>:</Text>
                <Text style={styles.fieldValue}>{data?.address}</Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#09090F",
            borderTopStyle: "dotted", // dotted line
          }}
        ></View>

        <View style={styles.customerDetails}>
          <View style={{ marginTop: "5px" }}>
            <View style={styles.datalist}>
              <Text style={styles.otherFieldName}>
                Loan Amount (Principal){" "}
              </Text>{" "}
              <Text>:</Text>
              <Text style={{ ...styles.rupee, ...styles.fieldValue }}>
                {formatNumber({ value: data?.principalAmt ?? 0 })}
              </Text>
            </View>
            <View style={styles.datalist}>
              <Text style={styles.otherFieldName}>Total Interest Accrued </Text>{" "}
              <Text>:</Text>
              <Text style={styles.fieldValue}> {data?.interestRate} </Text>
            </View>
            <View style={styles.datalist}>
              <Text style={styles.otherFieldName}>Total Amount Paid </Text>{" "}
              <Text>:</Text>
              <Text style={{ ...styles.rupee, ...styles.fieldValue }}>
                {formatNumber({ value: data?.totalPaidAmount })}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: "5px" }}>
            <View style={styles.datalist}>
              <Text style={styles.fieldName}></Text>
              <Text style={styles.fieldValue}></Text>
            </View>
            <View style={styles.datalist}>
              <Text style={styles.fieldName}> </Text>
              <Text style={styles.fieldValue}></Text>
            </View>
            <View style={styles.datalist}>
              <Text style={styles.fieldName}> </Text>
              <Text style={styles.fieldValue}></Text>
            </View>
          </View>

          <View style={{ marginTop: "5px" }}>
            <View style={styles.datalist}>
              <Text style={styles.fieldName}>Settlement Date </Text>
              <Text>:</Text>
              <Text style={styles.fieldValue}>02/06/2025</Text>
            </View>
            <View style={styles.datalist}>
              <Text style={styles.fieldName}>Other Charges </Text>
              <Text>:</Text>
              <Text style={{ ...styles.rupee, ...styles.fieldValue }}>
                {formatNumber({ value: data?.otherCharges ?? 0 })}
              </Text>
            </View>
          </View>
        </View>

        {/* item details */}
        <View>
          <Text style={styles.itemTitle}>Loan Settlement Details</Text>
          <View
            style={{
              borderTop: "1px",
              borderColor: "#09090F",
              ...styles.itemDetailsContainer,
            }}
          >
            {/* Header Row */}
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Metal</Text>
              <Text style={styles.tableHeader}>Purity</Text>
              <Text style={styles.tableHeader}>Gross WT</Text>
              <Text style={styles.tableHeader}>NET WT</Text>
            </View>

            {data?.Items?.map((item: any, index: any) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {item?.metal?.metalName || "-"}
                </Text>
                <Text style={styles.tableCell}>
                  {item?.purity?.purityName || "-"}
                </Text>
                <Text style={styles.tableCell}>
                  {spliceDecimals(item?.grossWt,3)}g
                </Text>
                <Text style={styles.tableCell}>{spliceDecimals(item?.netWt,3)}g</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const LoanClosure = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const iframeRef = useRef(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(true);
  const [loanData, setLoanData] = useState<any>(null);

  const { loanView } = useSelector((states: any) => ({
    loanView: states[CLOSE_ACCOUNT_PRINT_RES]?.data,
  }));

  useEffect(() => {
    if (id) {
      dispatch(
        apiRequest(CLOSE_ACCOUNT_PRINT_RES, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "closePrint",
          params: {
            tableName: "closeAcccount",
            procedureName: "closePrint",
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
      dispatch(apiClear(CLOSE_ACCOUNT_PRINT_RES));
    };
  }, [dispatch]);

  // For demo purposes, create sample data if none is available yet

  useEffect(() => {
    if (!loanData) {
      return;
    }
    generatePdf();
    const timer = setTimeout(() => {
      handlePrint();
    }, 1000);

    return () => clearTimeout(timer);
  }, [loanData]);

  const generatePdf = async () => {
    const blob = await pdf(<DFIReport data={loanData} />).toBlob();
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
              bgcolor: "black", // keep the same background color
            },
          }}
          //   startIcon={<PictureAsPdf />}
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
                  color: "white", // keep the same background color
                },
              }}
              onClick={() => navigate(`/inventoryreports/accountsclosure`)}
            >
              Back
            </Button>
            <Button
              sx={{
                bgcolor: "black",
                color: "white",
                "&:hover": {
                  bgcolor: "black", // keep the same background color
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

export default LoanClosure;

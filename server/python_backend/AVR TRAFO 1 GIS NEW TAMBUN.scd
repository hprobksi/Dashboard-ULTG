<?xml version="1.0" encoding="UTF-8"?>
<!--Created by rhard with OMICRON IEDScout 4.20 licensed to -->
<!--SCL Schema Version 3.1 (2012/10/22)-->
<SCL version="2007" revision="B" xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.iec.ch/61850/2003/SCL SCL.xsd">
	<Header id="" version="" revision="" toolID="OMICRON IEDScout" nameStructure="IEDName" />
	<Communication>
		<SubNetwork name="NONE" type="8-MMS">
			<ConnectedAP iedName="E12N901E12" apName="P1">
				<Address>
					<P type="IP" xsi:type="tP_IP">172.20.121.96</P>
					<P type="OSI-TSEL" xsi:type="tP_OSI-TSEL">0001</P>
					<P type="OSI-SSEL" xsi:type="tP_OSI-SSEL">0001</P>
					<P type="OSI-PSEL" xsi:type="tP_OSI-PSEL">00000001</P>
					<P type="OSI-AP-Title">1,1,1,999,1</P>
					<P type="OSI-AP-Invoke" xsi:type="tP_OSI-AP-Invoke">0</P>
					<P type="OSI-AE-Qualifier" xsi:type="tP_OSI-AE-Qualifier">12</P>
					<P type="OSI-AE-Invoke" xsi:type="tP_OSI-AE-Invoke">0</P>
					<P type="MMS-Port" xsi:type="tP_MMS-Port">102</P>
				</Address>
			</ConnectedAP>
		</SubNetwork>
	</Communication>
	<IED name="E12N901E12">
		<Services>
			<DynAssociation />
			<GetDirectory />
			<GetDataObjectDefinition />
			<DataObjectDirectory />
			<GetDataSetValue />
			<SetDataSetValue />
			<DataSetDirectory />
			<ConfDataSet max="4" modify="false" />
			<DynDataSet max="42" />
			<ReadWrite />
			<ConfReportControl max="20" bufConf="false" />
			<GetCBValues />
			<ReportSettings rptID="Dyn" optFields="Dyn" bufTime="Dyn" trgOps="Dyn" intgPd="Dyn" />
			<ConfLNs fixPrefix="true" fixLnInst="true" />
			<GOOSE max="0" />
			<GSSE max="0" />
			<FileHandling />
		</Services>
		<AccessPoint name="P1">
			<Server>
				<Authentication none="true" />
				<LDevice inst="N901">
					<LN0 lnType="E12N901E12N901.LLN0" lnClass="LLN0" inst="">
						<DataSet name="DataSetMX01">
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="CtlV" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="LodA" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="CtlDv" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="PhAng" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="CircA" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="PPV" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="PNV" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="A" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="TotW" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="TotVAr" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="TotVA" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="TotPF" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="Hz" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="W" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="VAr" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="VA" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="PF" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="MMXU" lnInst="1" doName="PhAngTP" fc="MX" />
						</DataSet>
						<DataSet name="DataSetMX02">
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp1" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp2" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp3" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp4" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp5" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp6" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp7" fc="MX" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp8" fc="MX" />
						</DataSet>
						<DataSet name="DataSetST01">
							<FCDA ldInst="N901" prefix="" lnClass="LLN0" doName="Mod" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="LLN0" doName="Beh" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="LLN0" doName="Health" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="LLN0" doName="Loc" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="LPHD" lnInst="1" doName="PhyHealth" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="LPHD" lnInst="1" doName="Proxy" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="TapChg" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="ParOp" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="LTCBlkVLo" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="LTCBlkVHi" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="LTCBlkAHi" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="OpCntRs" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="LTCBlk" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="Auto" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="FuncMon" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="TapOpErr" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="MotDrv" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="MasterSel" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="FollowSel" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="CircASel" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="CircAPFSel" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="ErrPar" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="BndCtrAct1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="BndCtrAct2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="ATCC" lnInst="1" doName="BndCtrAct3" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="OvVEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnVEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="OvAEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnAEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="OvVAEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="OvVA2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnVAEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnVA2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="OvWEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="OvW2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnWEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnW2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="OvVArEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="OvVAr2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnVArEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnVAr2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnPFEx" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnPF2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="OvV2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnV2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="OvA2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="UnA2Ex" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="YPTR" lnInst="1" doName="VInFail" fc="ST" />
						</DataSet>
						<DataSet name="DataSetST03">
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind3" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind4" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind5" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind6" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind7" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind8" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind9" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind10" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind11" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind12" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind13" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind14" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind15" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind16" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind17" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind18" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind19" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind20" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind21" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind22" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind23" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind24" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind25" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind26" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind27" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind28" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind29" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind30" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind31" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind32" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind33" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind34" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind35" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind36" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind37" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind38" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind39" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind40" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind41" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="1" doName="Ind42" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp1L2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp1L1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp1H1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp1H2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp2L2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp2L1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp2H1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp2H2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp3L2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp3L1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp3H1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp3H2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp4L2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp4L1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp4H1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp4H2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp5L2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp5L1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp5H1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp5H2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp6L2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp6L1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp6H1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp6H2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp7L2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp7L1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp7H1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp7H2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp8L2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp8L1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp8H1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="2" doName="Tmp8H2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="Ind1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="Ind2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="Ind3" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="Ind4" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="Ind5" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="Ind6" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="Ind7" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="Ind8" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="Ind9" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="Ind10" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="SPCSO1" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="SPCSO2" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="SPCSO3" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="SPCSO4" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="SPCSO5" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="SPCSO6" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="SPCSO7" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="SPCSO8" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="SPCSO9" fc="ST" />
							<FCDA ldInst="N901" prefix="" lnClass="GGIO" lnInst="3" doName="SPCSO10" fc="ST" />
						</DataSet>
						<ReportControl name="urcbMX01" rptID="LN0$MX01$Unbuffered" buffered="false" bufTime="0" intgPd="0" confRev="1" datSet="DataSetMX01">
							<TrgOps dchg="true" qchg="true" dupd="false" period="true" gi="true" />
							<OptFields seqNum="true" timeStamp="false" dataSet="false" reasonCode="true" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<ReportControl name="urcbMX02" rptID="LN0$MX02$Unbuffered" buffered="false" bufTime="0" datSet="DataSetMX02" intgPd="0" confRev="1">
							<TrgOps dchg="true" qchg="true" dupd="false" period="true" gi="true" />
							<OptFields seqNum="true" timeStamp="false" dataSet="false" reasonCode="true" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<ReportControl name="brcbST01" rptID="LN0$ST01$Buffered" buffered="true" bufTime="0" datSet="DataSetST01" intgPd="0" confRev="1">
							<TrgOps dchg="true" qchg="true" dupd="false" period="true" gi="true" />
							<OptFields seqNum="true" timeStamp="true" dataSet="false" reasonCode="true" dataRef="false" entryID="true" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<ReportControl name="brcbST03" rptID="LN0$ST03$Buffered" buffered="true" bufTime="100" datSet="DataSetST03" intgPd="0" confRev="1">
							<TrgOps dchg="true" qchg="true" dupd="false" period="true" gi="true" />
							<OptFields seqNum="true" timeStamp="true" dataSet="true" reasonCode="true" dataRef="false" entryID="true" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Mode (No value change)</Val>
							</DAI>
						</DOI>
						<DOI name="Beh">
							<DAI name="d">
								<Val>Behaviour (No value change)</Val>
							</DAI>
						</DOI>
						<DOI name="Health">
							<DAI name="d">
								<Val>Health (For all LNs the same value)</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>Maschinenfabrik Reinhausen</Val>
							</DAI>
							<DAI name="swRev">
								<Val>3.172</Val>
							</DAI>
							<DAI name="d">
								<Val>Name plate</Val>
							</DAI>
							<DAI name="configRev">
								<Val>1</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
						<DOI name="Loc">
							<DAI name="d">
								<Val>Local operation (For all LNs the same value)</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="E12N901E12N901.ATCC1" lnClass="ATCC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Mode</Val>
							</DAI>
						</DOI>
						<DOI name="Beh">
							<DAI name="d">
								<Val>Behaviour</Val>
							</DAI>
						</DOI>
						<DOI name="Health">
							<DAI name="d">
								<Val>Health</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>Maschinenfabrik Reinhausen</Val>
							</DAI>
							<DAI name="swRev">
								<Val>3.172</Val>
							</DAI>
							<DAI name="d">
								<Val>Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Loc">
							<DAI name="d">
								<Val>Local operation</Val>
							</DAI>
						</DOI>
						<DOI name="OpCntRs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Resettable operation counter</Val>
							</DAI>
						</DOI>
						<DOI name="TapChg">
							<DAI name="persistent">
								<Val>0</Val>
							</DAI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Change Tap Position</Val>
							</DAI>
						</DOI>
						<DOI name="ParOp">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Parallel/Independent</Val>
							</DAI>
						</DOI>
						<DOI name="LTCBlk">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Block Automatic Control</Val>
							</DAI>
						</DOI>
						<DOI name="CtlV">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>V</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Control Voltage</Val>
							</DAI>
						</DOI>
						<DOI name="LodA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Load Current (transformer secondary current)</Val>
							</DAI>
						</DOI>
						<DOI name="MasterSel">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Master mode selection activation(parallel control)</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="FollowSel">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Follower mode selection activation(parallel control)</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="CircA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Circulating Current (reactive)</Val>
							</DAI>
						</DOI>
						<DOI name="CircASel">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Circulating current selection activation (parallel control)</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="CircAPFSel">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Desired power factor selection activation (parallel control)</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="RefPF">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Desired power factor</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.95</Val>
								</DAI>
							</SDI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="RefLodTyp">
							<DAI name="d">
								<Val>Desired load type selection (0=ind., 1=cap.)</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="PhAng">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Phase Angle of LodA relative to CtlV</Val>
							</DAI>
						</DOI>
						<DOI name="FuncMon">
							<DAI name="d">
								<Val>Function monitoring</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Auto">
							<DAI name="d">
								<Val>Automatic Manual</Val>
							</DAI>
						</DOI>
						<DOI name="BndCtr">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>V</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Band center voltage (actual reference - can not be set)</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>20700.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="BndWid">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val>c</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Band width voltage (as percent of nominal voltage)</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.5</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="CtlDlTms">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>s</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Control intentional time delay T1 (in seconds)</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>40.0</Val>
								</DAI>
							</SDI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="LDCR">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Line drop voltage due to line resistance component (ohmic behaviour of the cable)</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LDCX">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Line drop voltage due to line reactance component (inductive behaviour of the cable)</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="BlkLV">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val>c</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Control voltage below which auto Lower commands blocked (relative)</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>90.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LimLodA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val>c</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Limit Load Current (LTC Block Load Current, percentage)</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>120.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="CtlDv">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val>c</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Control Voltage Deviation (in percent of BndCtr)</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="LTCBlkVLo">
							<DAI name="d">
								<Val>LTC inhibit due to under voltage</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="LTCBlkVHi">
							<DAI name="d">
								<Val>LTC inhibit due to over voltage</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="LTCBlkAHi">
							<DAI name="d">
								<Val>LTC inhibit due to over current</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="LDC">
							<DAI name="d">
								<Val>Line drop compensation. LDC is R and X or Z model TRUE = R and X, FALSE = Z. If compensation is deactivated, value is set to TRUE</Val>
							</DAI>
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="TmDlChr">
							<DAI name="d">
								<Val>Time delay linear or integral characteristic (0=lin., 1=int.)</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LDCZ">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val>c</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Line drop voltage due to line total impedance (percentage of nominal voltage)</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ErrPar">
							<DAI name="d">
								<Val>Error of parallel operation</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="BndCtrV1">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>V</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Band center voltage 1</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>20700.0</Val>
								</DAI>
							</SDI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="BndCtrAct1">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Band center voltage (desired value) 1 active</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="BndCtrAct2">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Band center voltage (desired value) 2 active</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="BndCtrAct3">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Band center voltage (desired value) 3 active</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="BndCtrV2">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>V</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Band center voltage 2</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>20000.0</Val>
								</DAI>
							</SDI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="BndCtrV3">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>V</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Band center voltage 3</Val>
							</DAI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>20000.0</Val>
								</DAI>
							</SDI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="TapOpErr">
							<DAI name="d">
								<Val>Tap inidication error (e.g. wrong BCD code)</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="MotDrv">
							<DAI name="d">
								<Val>Motor drive running</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="E12N901E12N901.AVCO1" lnClass="AVCO" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Mode</Val>
							</DAI>
						</DOI>
						<DOI name="Beh">
							<DAI name="d">
								<Val>Behaviour</Val>
							</DAI>
						</DOI>
						<DOI name="Health">
							<DAI name="d">
								<Val>Health</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>Maschinenfabrik Reinhausen</Val>
							</DAI>
							<DAI name="swRev">
								<Val>3.172</Val>
							</DAI>
							<DAI name="d">
								<Val>Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Loc">
							<DAI name="d">
								<Val>Local operation</Val>
							</DAI>
						</DOI>
						<DOI name="TapChg">
							<DAI name="persistent">
								<Val>0</Val>
							</DAI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Change Voltage</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="E12N901E12N901.GGIO1" lnClass="GGIO" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Mode</Val>
							</DAI>
						</DOI>
						<DOI name="Beh">
							<DAI name="d">
								<Val>Behaviour</Val>
							</DAI>
						</DOI>
						<DOI name="Health">
							<DAI name="d">
								<Val>Health</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>Maschinenfabrik Reinhausen</Val>
							</DAI>
							<DAI name="swRev">
								<Val>3.172</Val>
							</DAI>
							<DAI name="d">
								<Val>Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Ind1">
							<DAI name="d">
								<Val>DI 1</Val>
							</DAI>
						</DOI>
						<DOI name="Ind2">
							<DAI name="d">
								<Val>DI 2</Val>
							</DAI>
						</DOI>
						<DOI name="Ind3">
							<DAI name="d">
								<Val>DI 3</Val>
							</DAI>
						</DOI>
						<DOI name="Ind4">
							<DAI name="d">
								<Val>DI 4</Val>
							</DAI>
						</DOI>
						<DOI name="Ind5">
							<DAI name="d">
								<Val>DI 5</Val>
							</DAI>
						</DOI>
						<DOI name="Ind6">
							<DAI name="d">
								<Val>DI 6</Val>
							</DAI>
						</DOI>
						<DOI name="Ind7">
							<DAI name="d">
								<Val>DI 7</Val>
							</DAI>
						</DOI>
						<DOI name="Ind8">
							<DAI name="d">
								<Val>DI 9</Val>
							</DAI>
						</DOI>
						<DOI name="Ind9">
							<DAI name="d">
								<Val>DI 10</Val>
							</DAI>
						</DOI>
						<DOI name="Ind10">
							<DAI name="d">
								<Val>DI 11</Val>
							</DAI>
						</DOI>
						<DOI name="Ind11">
							<DAI name="d">
								<Val>DI 12</Val>
							</DAI>
						</DOI>
						<DOI name="Ind12">
							<DAI name="d">
								<Val>DI 13</Val>
							</DAI>
						</DOI>
						<DOI name="Ind13">
							<DAI name="d">
								<Val>DI 14</Val>
							</DAI>
						</DOI>
						<DOI name="Ind14">
							<DAI name="d">
								<Val>DI 15</Val>
							</DAI>
						</DOI>
						<DOI name="Ind15">
							<DAI name="d">
								<Val>DI 17</Val>
							</DAI>
						</DOI>
						<DOI name="Ind16">
							<DAI name="d">
								<Val>DI 18</Val>
							</DAI>
						</DOI>
						<DOI name="Ind17">
							<DAI name="d">
								<Val>DI 19</Val>
							</DAI>
						</DOI>
						<DOI name="Ind18">
							<DAI name="d">
								<Val>DI 20</Val>
							</DAI>
						</DOI>
						<DOI name="Ind19">
							<DAI name="d">
								<Val>DI 21</Val>
							</DAI>
						</DOI>
						<DOI name="Ind20">
							<DAI name="d">
								<Val>DI 22</Val>
							</DAI>
						</DOI>
						<DOI name="Ind21">
							<DAI name="d">
								<Val>DI 23</Val>
							</DAI>
						</DOI>
						<DOI name="Ind22">
							<DAI name="d">
								<Val>DI 25</Val>
							</DAI>
						</DOI>
						<DOI name="Ind23">
							<DAI name="d">
								<Val>DI 26</Val>
							</DAI>
						</DOI>
						<DOI name="Ind24">
							<DAI name="d">
								<Val>DI 27</Val>
							</DAI>
						</DOI>
						<DOI name="Ind25">
							<DAI name="d">
								<Val>DI 28</Val>
							</DAI>
						</DOI>
						<DOI name="Ind26">
							<DAI name="d">
								<Val>DI 29</Val>
							</DAI>
						</DOI>
						<DOI name="Ind27">
							<DAI name="d">
								<Val>DI 30</Val>
							</DAI>
						</DOI>
						<DOI name="Ind28">
							<DAI name="d">
								<Val>DI 31</Val>
							</DAI>
						</DOI>
						<DOI name="Ind29">
							<DAI name="d">
								<Val>DI 33</Val>
							</DAI>
						</DOI>
						<DOI name="Ind30">
							<DAI name="d">
								<Val>DI 34</Val>
							</DAI>
						</DOI>
						<DOI name="Ind31">
							<DAI name="d">
								<Val>DI 35</Val>
							</DAI>
						</DOI>
						<DOI name="Ind32">
							<DAI name="d">
								<Val>DI 36</Val>
							</DAI>
						</DOI>
						<DOI name="Ind33">
							<DAI name="d">
								<Val>DI 37</Val>
							</DAI>
						</DOI>
						<DOI name="Ind34">
							<DAI name="d">
								<Val>DI 38</Val>
							</DAI>
						</DOI>
						<DOI name="Ind35">
							<DAI name="d">
								<Val>DI 39</Val>
							</DAI>
						</DOI>
						<DOI name="Ind36">
							<DAI name="d">
								<Val>DI 41</Val>
							</DAI>
						</DOI>
						<DOI name="Ind37">
							<DAI name="d">
								<Val>DI 42</Val>
							</DAI>
						</DOI>
						<DOI name="Ind38">
							<DAI name="d">
								<Val>DI 43</Val>
							</DAI>
						</DOI>
						<DOI name="Ind39">
							<DAI name="d">
								<Val>DI 44</Val>
							</DAI>
						</DOI>
						<DOI name="Ind40">
							<DAI name="d">
								<Val>DI 45</Val>
							</DAI>
						</DOI>
						<DOI name="Ind41">
							<DAI name="d">
								<Val>DI 46</Val>
							</DAI>
						</DOI>
						<DOI name="Ind42">
							<DAI name="d">
								<Val>DI 47</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="E12N901E12N901.GGIO2" lnClass="GGIO" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Mode</Val>
							</DAI>
						</DOI>
						<DOI name="Beh">
							<DAI name="d">
								<Val>Behaviour</Val>
							</DAI>
						</DOI>
						<DOI name="Health">
							<DAI name="d">
								<Val>Health</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>Maschinenfabrik Reinhausen</Val>
							</DAI>
							<DAI name="swRev">
								<Val>3.172</Val>
							</DAI>
							<DAI name="d">
								<Val>Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp1">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>General Purpose Temperature 1</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp1L2">
							<DAI name="d">
								<Val>General Purpose Temperature 1 low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp1L1">
							<DAI name="d">
								<Val>General Purpose Temperature 1 low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp1H1">
							<DAI name="d">
								<Val>General Purpose Temperature 1 high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp1H2">
							<DAI name="d">
								<Val>General Purpose Temperature 1 high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp2">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>General Purpose Temperature 2</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp2L2">
							<DAI name="d">
								<Val>General Purpose Temperature 2 low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp2L1">
							<DAI name="d">
								<Val>General Purpose Temperature 2 low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp2H1">
							<DAI name="d">
								<Val>General Purpose Temperature 2 high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp2H2">
							<DAI name="d">
								<Val>General Purpose Temperature 2 high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp3">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>General Purpose Temperature 3</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp3L2">
							<DAI name="d">
								<Val>General Purpose Temperature 3 low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp3L1">
							<DAI name="d">
								<Val>General Purpose Temperature 3 low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp3H1">
							<DAI name="d">
								<Val>General Purpose Temperature 3 high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp3H2">
							<DAI name="d">
								<Val>General Purpose Temperature 3 high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp4">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>General Purpose Temperature 4</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp4L2">
							<DAI name="d">
								<Val>General Purpose Temperature 4 low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp4L1">
							<DAI name="d">
								<Val>General Purpose Temperature 4 low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp4H1">
							<DAI name="d">
								<Val>General Purpose Temperature 4 high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp4H2">
							<DAI name="d">
								<Val>General Purpose Temperature 4 high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp5">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>General Purpose Temperature 5</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp5L2">
							<DAI name="d">
								<Val>General Purpose Temperature 5 low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp5L1">
							<DAI name="d">
								<Val>General Purpose Temperature 5 low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp5H1">
							<DAI name="d">
								<Val>General Purpose Temperature 5 high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp5H2">
							<DAI name="d">
								<Val>General Purpose Temperature 5 high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp6">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>General Purpose Temperature 6</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp6L2">
							<DAI name="d">
								<Val>General Purpose Temperature 6 low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp6L1">
							<DAI name="d">
								<Val>General Purpose Temperature 6 low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp6H1">
							<DAI name="d">
								<Val>General Purpose Temperature 6 high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp6H2">
							<DAI name="d">
								<Val>General Purpose Temperature 6 high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp7">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>General Purpose Temperature 7</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp7L2">
							<DAI name="d">
								<Val>General Purpose Temperature 7 low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp7L1">
							<DAI name="d">
								<Val>General Purpose Temperature 7 low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp7H1">
							<DAI name="d">
								<Val>General Purpose Temperature 7 high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp7H2">
							<DAI name="d">
								<Val>General Purpose Temperature 7 high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp8">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>General Purpose Temperature 8</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp8L2">
							<DAI name="d">
								<Val>General Purpose Temperature 8 low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp8L1">
							<DAI name="d">
								<Val>General Purpose Temperature 8 low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp8H1">
							<DAI name="d">
								<Val>General Purpose Temperature 8 high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp8H2">
							<DAI name="d">
								<Val>General Purpose Temperature 8 high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="E12N901E12N901.GGIO3" lnClass="GGIO" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Mode</Val>
							</DAI>
						</DOI>
						<DOI name="Beh">
							<DAI name="d">
								<Val>Behaviour</Val>
							</DAI>
						</DOI>
						<DOI name="Health">
							<DAI name="d">
								<Val>Health</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>Maschinenfabrik Reinhausen</Val>
							</DAI>
							<DAI name="swRev">
								<Val>3.172</Val>
							</DAI>
							<DAI name="d">
								<Val>Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO1">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Generic command 1</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO2">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Generic command 2</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO3">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Generic command 3</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO4">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Generic command 4</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO5">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Generic command 5</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO6">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Generic command 6</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO7">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Generic command 7</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO8">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Generic command 8</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO9">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Generic command 9</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO10">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Generic command 10</Val>
							</DAI>
						</DOI>
						<DOI name="Ind1">
							<DAI name="d">
								<Val>Generic indication 1</Val>
							</DAI>
						</DOI>
						<DOI name="Ind2">
							<DAI name="d">
								<Val>Generic indication 2</Val>
							</DAI>
						</DOI>
						<DOI name="Ind3">
							<DAI name="d">
								<Val>Generic indication 3</Val>
							</DAI>
						</DOI>
						<DOI name="Ind4">
							<DAI name="d">
								<Val>Generic indication 4</Val>
							</DAI>
						</DOI>
						<DOI name="Ind5">
							<DAI name="d">
								<Val>Generic indication 5</Val>
							</DAI>
						</DOI>
						<DOI name="Ind6">
							<DAI name="d">
								<Val>Generic indication 6</Val>
							</DAI>
						</DOI>
						<DOI name="Ind7">
							<DAI name="d">
								<Val>Generic indication 7</Val>
							</DAI>
						</DOI>
						<DOI name="Ind8">
							<DAI name="d">
								<Val>Generic indication 8</Val>
							</DAI>
						</DOI>
						<DOI name="Ind9">
							<DAI name="d">
								<Val>Generic indication 9</Val>
							</DAI>
						</DOI>
						<DOI name="Ind10">
							<DAI name="d">
								<Val>Generic indication 10</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="E12N901E12N901.LPHD1" lnClass="LPHD" inst="1">
						<DOI name="PhyNam">
							<DAI name="vendor">
								<Val>Maschinenfabrik Reinhausen</Val>
							</DAI>
							<DAI name="hwRev">
								<Val>1.0</Val>
							</DAI>
							<DAI name="swRev">
								<Val>3.172</Val>
							</DAI>
							<DAI name="serNum">
								<Val>1797558</Val>
							</DAI>
							<DAI name="model">
								<Val>ISM</Val>
							</DAI>
							<DAI name="location">
								<Val>GERMANY, 93059 Regensburg, Falkensteinstr. 8</Val>
							</DAI>
						</DOI>
						<DOI name="PhyHealth">
							<DAI name="d">
								<Val>Physical device health</Val>
							</DAI>
						</DOI>
						<DOI name="Proxy">
							<DAI name="d">
								<Val>Indicates if this LN is a proxy</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="E12N901E12N901.MMXU1" lnClass="MMXU" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Mode</Val>
							</DAI>
						</DOI>
						<DOI name="Beh">
							<DAI name="d">
								<Val>Behaviour</Val>
							</DAI>
						</DOI>
						<DOI name="Health">
							<DAI name="d">
								<Val>Health</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>Maschinenfabrik Reinhausen</Val>
							</DAI>
							<DAI name="swRev">
								<Val>3.172</Val>
							</DAI>
							<DAI name="d">
								<Val>Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="TotW">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>Watts</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Total active power (total P)</Val>
							</DAI>
						</DOI>
						<DOI name="TotVAr">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VAr</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Total reactive power (total Q)</Val>
							</DAI>
						</DOI>
						<DOI name="TotVA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VA</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Total apparent power (total S)</Val>
							</DAI>
						</DOI>
						<DOI name="TotPF">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Average power factor (total PF)</Val>
							</DAI>
						</DOI>
						<DOI name="Hz">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>Hz</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Frequency</Val>
							</DAI>
						</DOI>
						<DOI name="PPV">
							<SDI name="phsAB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsBC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsCA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Phase to phase voltages (VL1VL2, ...)</Val>
							</DAI>
						</DOI>
						<DOI name="PNV">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Phase to neutral voltage</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="A">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="neut">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Phase currents (IL1, IL2, IL3)</Val>
							</DAI>
						</DOI>
						<DOI name="W">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>Watts</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>Watts</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>Watts</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Phase active power (P)</Val>
							</DAI>
						</DOI>
						<DOI name="VAr">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VAr</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VAr</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VAr</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Phase reactive power (Q)</Val>
							</DAI>
						</DOI>
						<DOI name="VA">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VA</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VA</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VA</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Phase apparent power (S)</Val>
							</DAI>
						</DOI>
						<DOI name="PF">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val></Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val></Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val></Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Phase power factor</Val>
							</DAI>
						</DOI>
						<DOI name="PhAngTP">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>deg</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>deg</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>deg</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="d">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Phase Angle three pole</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="E12N901E12N901.YPTR1" lnClass="YPTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Mode</Val>
							</DAI>
						</DOI>
						<DOI name="Beh">
							<DAI name="d">
								<Val>Behaviour</Val>
							</DAI>
						</DOI>
						<DOI name="Health">
							<DAI name="d">
								<Val>Health</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>Maschinenfabrik Reinhausen</Val>
							</DAI>
							<DAI name="swRev">
								<Val>3.172</Val>
							</DAI>
							<DAI name="d">
								<Val>Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="OvVEx">
							<DAI name="d">
								<Val>Voltage high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnVEx">
							<DAI name="d">
								<Val>Voltage low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="OvAEx">
							<DAI name="d">
								<Val>Current overload</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnAEx">
							<DAI name="d">
								<Val>Current underload</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="OvVAEx">
							<DAI name="d">
								<Val>Apparent power high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="OvVA2Ex">
							<DAI name="d">
								<Val>Apparent power high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnVAEx">
							<DAI name="d">
								<Val>Apparent power low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnVA2Ex">
							<DAI name="d">
								<Val>Apparent power low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="OvWEx">
							<DAI name="d">
								<Val>Active power high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="OvW2Ex">
							<DAI name="d">
								<Val>Active power high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnWEx">
							<DAI name="d">
								<Val>Active power low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnW2Ex">
							<DAI name="d">
								<Val>Active power low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="OvVArEx">
							<DAI name="d">
								<Val>Reactive power high limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="OvVAr2Ex">
							<DAI name="d">
								<Val>Reactive power high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnVArEx">
							<DAI name="d">
								<Val>Reactive power low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnVAr2Ex">
							<DAI name="d">
								<Val>Reactive power low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnPFEx">
							<DAI name="d">
								<Val>Power Factor (Cosinus phi) low limit exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnPF2Ex">
							<DAI name="d">
								<Val>Power Factor (Cosinus phi) low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="OvV2Ex">
							<DAI name="d">
								<Val>Voltage high limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnV2Ex">
							<DAI name="d">
								<Val>Voltage low limit 2 exceeded</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="OvA2Ex">
							<DAI name="d">
								<Val>Current overload 2</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="UnA2Ex">
							<DAI name="d">
								<Val>Current underload 2</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
						<DOI name="VInFail">
							<DAI name="d">
								<Val>Voltage input failure (e.g. missing connection)</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>MR_DataSpace:2013A</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
			</Server>
		</AccessPoint>
	</IED>
	<DataTypeTemplates>
		<LNodeType id="E12N901E12N901.GGIO1" lnClass="GGIO">
			<DO name="Mod" type="E12N901E12N901.LLN0.Mod" />
			<DO name="Beh" type="E12N901E12N901.LLN0.Beh" />
			<DO name="Health" type="E12N901E12N901.LLN0.Health" />
			<DO name="NamPlt" type="E12N901E12N901.ATCC1.NamPlt" />
			<DO name="Ind1" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind2" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind3" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind4" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind5" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind6" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind7" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind8" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind9" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind10" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind11" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind12" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind13" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind14" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind15" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind16" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind17" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind18" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind19" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind20" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind21" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind22" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind23" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind24" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind25" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind26" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind27" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind28" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind29" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind30" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind31" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind32" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind33" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind34" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind35" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind36" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind37" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind38" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind39" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind40" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind41" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind42" type="E12N901E12N901.LLN0.Loc" />
		</LNodeType>
		<LNodeType id="E12N901E12N901.GGIO2" lnClass="GGIO">
			<DO name="Mod" type="E12N901E12N901.LLN0.Mod" />
			<DO name="Beh" type="E12N901E12N901.LLN0.Beh" />
			<DO name="Health" type="E12N901E12N901.LLN0.Health" />
			<DO name="NamPlt" type="E12N901E12N901.ATCC1.NamPlt" />
			<DO name="Tmp1" type="E12N901E12N901.ATCC1.CtlDv" />
			<DO name="Tmp1L2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp1L1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp1H1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp1H2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp2" type="E12N901E12N901.ATCC1.CtlDv" />
			<DO name="Tmp2L2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp2L1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp2H1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp2H2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp3" type="E12N901E12N901.ATCC1.CtlDv" />
			<DO name="Tmp3L2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp3L1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp3H1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp3H2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp4" type="E12N901E12N901.ATCC1.CtlDv" />
			<DO name="Tmp4L2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp4L1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp4H1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp4H2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp5" type="E12N901E12N901.ATCC1.CtlDv" />
			<DO name="Tmp5L2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp5L1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp5H1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp5H2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp6" type="E12N901E12N901.ATCC1.CtlDv" />
			<DO name="Tmp6L2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp6L1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp6H1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp6H2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp7" type="E12N901E12N901.ATCC1.CtlDv" />
			<DO name="Tmp7L2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp7L1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp7H1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp7H2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp8" type="E12N901E12N901.ATCC1.CtlDv" />
			<DO name="Tmp8L2" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp8L1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp8H1" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Tmp8H2" type="E12N901E12N901.ATCC1.FuncMon" />
		</LNodeType>
		<LNodeType id="E12N901E12N901.GGIO3" lnClass="GGIO">
			<DO name="Mod" type="E12N901E12N901.LLN0.Mod" />
			<DO name="Beh" type="E12N901E12N901.LLN0.Beh" />
			<DO name="Health" type="E12N901E12N901.LLN0.Health" />
			<DO name="NamPlt" type="E12N901E12N901.ATCC1.NamPlt" />
			<DO name="SPCSO1" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="SPCSO2" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="SPCSO3" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="SPCSO4" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="SPCSO5" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="SPCSO6" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="SPCSO7" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="SPCSO8" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="SPCSO9" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="SPCSO10" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="Ind1" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind2" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind3" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind4" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind5" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind6" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind7" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind8" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind9" type="E12N901E12N901.LLN0.Loc" />
			<DO name="Ind10" type="E12N901E12N901.LLN0.Loc" />
		</LNodeType>
		<LNodeType id="E12N901E12N901.LLN0" lnClass="LLN0">
			<DO name="Mod" type="E12N901E12N901.LLN0.Mod" />
			<DO name="Beh" type="E12N901E12N901.LLN0.Beh" />
			<DO name="Health" type="E12N901E12N901.LLN0.Health" />
			<DO name="NamPlt" type="E12N901E12N901.LLN0.NamPlt" />
			<DO name="Loc" type="E12N901E12N901.LLN0.Loc" />
		</LNodeType>
		<LNodeType id="E12N901E12N901.LPHD1" lnClass="LPHD">
			<DO name="PhyNam" type="E12N901E12N901.LPHD1.PhyNam" />
			<DO name="PhyHealth" type="E12N901E12N901.LLN0.Health" />
			<DO name="Proxy" type="E12N901E12N901.LLN0.Loc" />
		</LNodeType>
		<LNodeType id="E12N901E12N901.MMXU1" lnClass="MMXU">
			<DO name="Mod" type="E12N901E12N901.LLN0.Mod" />
			<DO name="Beh" type="E12N901E12N901.LLN0.Beh" />
			<DO name="Health" type="E12N901E12N901.LLN0.Health" />
			<DO name="NamPlt" type="E12N901E12N901.ATCC1.NamPlt" />
			<DO name="TotW" type="E12N901E12N901.ATCC1.CtlV" />
			<DO name="TotVAr" type="E12N901E12N901.ATCC1.CtlV" />
			<DO name="TotVA" type="E12N901E12N901.ATCC1.CtlV" />
			<DO name="TotPF" type="E12N901E12N901.ATCC1.CtlV" />
			<DO name="Hz" type="E12N901E12N901.ATCC1.CtlV" />
			<DO name="PPV" type="E12N901E12N901.MMXU1.PPV" />
			<DO name="PNV" type="E12N901E12N901.MMXU1.PNV" />
			<DO name="A" type="E12N901E12N901.MMXU1.A" />
			<DO name="W" type="E12N901E12N901.MMXU1.W" />
			<DO name="VAr" type="E12N901E12N901.MMXU1.W" />
			<DO name="VA" type="E12N901E12N901.MMXU1.W" />
			<DO name="PF" type="E12N901E12N901.MMXU1.W" />
			<DO name="PhAngTP" type="E12N901E12N901.MMXU1.PNV" />
		</LNodeType>
		<LNodeType id="E12N901E12N901.YPTR1" lnClass="YPTR">
			<DO name="Mod" type="E12N901E12N901.LLN0.Mod" />
			<DO name="Beh" type="E12N901E12N901.LLN0.Beh" />
			<DO name="Health" type="E12N901E12N901.LLN0.Health" />
			<DO name="NamPlt" type="E12N901E12N901.ATCC1.NamPlt" />
			<DO name="OvVEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnVEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="OvAEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnAEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="OvVAEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="OvVA2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnVAEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnVA2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="OvWEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="OvW2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnWEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnW2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="OvVArEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="OvVAr2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnVArEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnVAr2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnPFEx" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnPF2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="OvV2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnV2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="OvA2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="UnA2Ex" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="VInFail" type="E12N901E12N901.ATCC1.FuncMon" />
		</LNodeType>
		<LNodeType id="E12N901E12N901.ATCC1" lnClass="ATCC">
			<DO name="Mod" type="E12N901E12N901.LLN0.Mod" />
			<DO name="Beh" type="E12N901E12N901.LLN0.Beh" />
			<DO name="Health" type="E12N901E12N901.LLN0.Health" />
			<DO name="NamPlt" type="E12N901E12N901.ATCC1.NamPlt" />
			<DO name="Loc" type="E12N901E12N901.LLN0.Loc" />
			<DO name="OpCntRs" type="E12N901E12N901.ATCC1.OpCntRs" />
			<DO name="TapChg" type="E12N901E12N901.ATCC1.TapChg" />
			<DO name="ParOp" type="E12N901E12N901.ATCC1.ParOp" />
			<DO name="LTCBlk" type="E12N901E12N901.ATCC1.LTCBlk" />
			<DO name="CtlV" type="E12N901E12N901.ATCC1.CtlV" />
			<DO name="LodA" type="E12N901E12N901.ATCC1.CtlV" />
			<DO name="MasterSel" type="E12N901E12N901.ATCC1.MasterSel" />
			<DO name="FollowSel" type="E12N901E12N901.ATCC1.MasterSel" />
			<DO name="CircA" type="E12N901E12N901.ATCC1.CtlV" />
			<DO name="CircASel" type="E12N901E12N901.ATCC1.MasterSel" />
			<DO name="CircAPFSel" type="E12N901E12N901.ATCC1.MasterSel" />
			<DO name="RefPF" type="E12N901E12N901.ATCC1.RefPF" />
			<DO name="RefLodTyp" type="E12N901E12N901.ATCC1.RefLodTyp" />
			<DO name="PhAng" type="E12N901E12N901.ATCC1.CtlV" />
			<DO name="FuncMon" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="Auto" type="E12N901E12N901.LLN0.Loc" />
			<DO name="BndCtr" type="E12N901E12N901.ATCC1.BndCtr" />
			<DO name="BndWid" type="E12N901E12N901.ATCC1.BndCtr" />
			<DO name="CtlDlTms" type="E12N901E12N901.ATCC1.RefPF" />
			<DO name="LDCR" type="E12N901E12N901.ATCC1.BndCtr" />
			<DO name="LDCX" type="E12N901E12N901.ATCC1.BndCtr" />
			<DO name="BlkLV" type="E12N901E12N901.ATCC1.BndCtr" />
			<DO name="LimLodA" type="E12N901E12N901.ATCC1.BndCtr" />
			<DO name="CtlDv" type="E12N901E12N901.ATCC1.CtlDv" />
			<DO name="LTCBlkVLo" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="LTCBlkVHi" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="LTCBlkAHi" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="LDC" type="E12N901E12N901.ATCC1.LDC" />
			<DO name="TmDlChr" type="E12N901E12N901.ATCC1.LDC" />
			<DO name="LDCZ" type="E12N901E12N901.ATCC1.BndCtr" />
			<DO name="ErrPar" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="BndCtrV1" type="E12N901E12N901.ATCC1.RefPF" />
			<DO name="BndCtrAct1" type="E12N901E12N901.ATCC1.MasterSel" />
			<DO name="BndCtrAct2" type="E12N901E12N901.ATCC1.MasterSel" />
			<DO name="BndCtrAct3" type="E12N901E12N901.ATCC1.MasterSel" />
			<DO name="BndCtrV2" type="E12N901E12N901.ATCC1.RefPF" />
			<DO name="BndCtrV3" type="E12N901E12N901.ATCC1.RefPF" />
			<DO name="TapOpErr" type="E12N901E12N901.ATCC1.FuncMon" />
			<DO name="MotDrv" type="E12N901E12N901.ATCC1.FuncMon" />
		</LNodeType>
		<LNodeType id="E12N901E12N901.AVCO1" lnClass="AVCO">
			<DO name="Mod" type="E12N901E12N901.LLN0.Mod" />
			<DO name="Beh" type="E12N901E12N901.LLN0.Beh" />
			<DO name="Health" type="E12N901E12N901.LLN0.Health" />
			<DO name="NamPlt" type="E12N901E12N901.ATCC1.NamPlt" />
			<DO name="Loc" type="E12N901E12N901.LLN0.Loc" />
			<DO name="TapChg" type="E12N901E12N901.ATCC1.TapChg" />
		</LNodeType>
		<DOType id="E12N901E12N901.ATCC1.RefPF" cdc="ASG">
			<DA name="units" fc="CF" bType="Struct" type="E12N901E12N901.ATCC1.CtlV.units" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="setMag" fc="SP" bType="Struct" type="E12N901E12N901.ATCC1.RefPF.setMag" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.BndCtr" cdc="ASG">
			<DA name="units" fc="CF" bType="Struct" type="E12N901E12N901.ATCC1.CtlV.units" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="setMag" fc="SP" bType="Struct" type="E12N901E12N901.ATCC1.RefPF.setMag" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.TapChg" cdc="BSC">
			<DA name="valWTr" fc="ST" bType="Struct" type="E12N901E12N901.ATCC1.TapChg.valWTr" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="E12N901E12N901.ATCC1.TapChg.Oper" />
			<DA name="persistent" fc="CF" bType="BOOLEAN" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.MMXU1.PPV.phsAB" cdc="CMV">
			<DA name="cVal" fc="MX" bType="Struct" type="E12N901E12N901.MMXU1.PPV.phsAB.cVal" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="E12N901E12N901.ATCC1.CtlV.units" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.MMXU1.PPV" cdc="DEL">
			<SDO name="phsAB" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<SDO name="phsBC" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<SDO name="phsCA" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.ParOp" cdc="DPC">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="E12N901E12N901.ATCC1.ParOp.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.LPHD1.PhyNam" cdc="DPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="hwRev" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="serNum" fc="DC" bType="VisString255" />
			<DA name="model" fc="DC" bType="VisString255" />
			<DA name="location" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.LLN0.Mod" cdc="INC">
			<DA name="stVal" fc="ST" bType="Enum" type="Mod" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.OpCntRs" cdc="INC">
			<DA name="stVal" fc="ST" bType="INT32" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="E12N901E12N901.ATCC1.OpCntRs.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.LLN0.Beh" cdc="INS">
			<DA name="stVal" fc="ST" bType="Enum" type="Beh" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.LLN0.Health" cdc="INS">
			<DA name="stVal" fc="ST" bType="Enum" type="Health" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.LLN0.NamPlt" cdc="LPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="configRev" fc="DC" bType="VisString255" />
			<DA name="ldNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.NamPlt" cdc="LPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.CtlV" cdc="MV">
			<DA name="mag" fc="MX" bType="Struct" type="E12N901E12N901.ATCC1.CtlV.mag" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="E12N901E12N901.ATCC1.CtlV.units" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.CtlDv" cdc="MV">
			<DA name="mag" fc="MX" bType="Struct" type="E12N901E12N901.ATCC1.CtlV.mag" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="E12N901E12N901.ATCC1.CtlV.units" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.LTCBlk" cdc="SPC">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="E12N901E12N901.ATCC1.ParOp.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.MasterSel" cdc="SPC">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="E12N901E12N901.ATCC1.ParOp.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.RefLodTyp" cdc="SPG">
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="setVal" fc="SP" bType="BOOLEAN" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.LDC" cdc="SPG">
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="setVal" fc="SP" bType="BOOLEAN" />
		</DOType>
		<DOType id="E12N901E12N901.LLN0.Loc" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.ATCC1.FuncMon" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.MMXU1.PNV" cdc="WYE">
			<SDO name="phsA" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<SDO name="phsB" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<SDO name="phsC" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.MMXU1.A" cdc="WYE">
			<SDO name="phsA" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<SDO name="phsB" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<SDO name="phsC" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<SDO name="neut" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="E12N901E12N901.MMXU1.W" cdc="WYE">
			<SDO name="phsA" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<SDO name="phsB" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<SDO name="phsC" type="E12N901E12N901.MMXU1.PPV.phsAB" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DAType id="E12N901E12N901.ATCC1.CtlV.mag">
			<BDA name="f" bType="FLOAT32" />
		</DAType>
		<DAType id="E12N901E12N901.ATCC1.RefPF.setMag">
			<BDA name="f" bType="FLOAT32" />
		</DAType>
		<DAType id="E12N901E12N901.ATCC1.OpCntRs.Oper.origin">
			<BDA name="orCat" bType="Enum" type="orCategory" />
			<BDA name="orIdent" bType="Octet64" />
		</DAType>
		<DAType id="E12N901E12N901.ATCC1.CtlV.units">
			<BDA name="SIUnit" bType="Enum" type="SIUnit" />
			<BDA name="multiplier" bType="Enum" type="multiplier" />
		</DAType>
		<DAType id="E12N901E12N901.ATCC1.TapChg.valWTr">
			<BDA name="posVal" bType="INT8" />
		</DAType>
		<DAType id="E12N901E12N901.MMXU1.PPV.phsAB.cVal">
			<BDA name="mag" bType="Struct" type="E12N901E12N901.ATCC1.CtlV.mag" />
		</DAType>
		<DAType id="E12N901E12N901.ATCC1.TapChg.Oper">
			<BDA name="ctlVal" bType="Tcmd" />
			<BDA name="origin" bType="Struct" type="E12N901E12N901.ATCC1.OpCntRs.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
			<BDA name="Check" bType="Check" />
		</DAType>
		<DAType id="E12N901E12N901.ATCC1.ParOp.Oper">
			<BDA name="ctlVal" bType="BOOLEAN" />
			<BDA name="origin" bType="Struct" type="E12N901E12N901.ATCC1.OpCntRs.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
			<BDA name="Check" bType="Check" />
		</DAType>
		<DAType id="E12N901E12N901.ATCC1.OpCntRs.Oper">
			<BDA name="ctlVal" bType="INT32" />
			<BDA name="origin" bType="Struct" type="E12N901E12N901.ATCC1.OpCntRs.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
			<BDA name="Check" bType="Check" />
		</DAType>
		<EnumType id="ctlModel">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="0">status-only</EnumVal>
			<EnumVal ord="1">direct-with-normal-security</EnumVal>
			<EnumVal ord="2">sbo-with-normal-security</EnumVal>
			<EnumVal ord="3">direct-with-enhanced-security</EnumVal>
			<EnumVal ord="4">sbo-with-enhanced-security</EnumVal>
		</EnumType>
		<EnumType id="orCategory">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="0">not-supported</EnumVal>
			<EnumVal ord="1">bay-control</EnumVal>
			<EnumVal ord="2">station-control</EnumVal>
			<EnumVal ord="3">remote-control</EnumVal>
			<EnumVal ord="4">automatic-bay</EnumVal>
			<EnumVal ord="5">automatic-station</EnumVal>
			<EnumVal ord="6">automatic-remote</EnumVal>
			<EnumVal ord="7">maintenance</EnumVal>
			<EnumVal ord="8">process</EnumVal>
		</EnumType>
		<EnumType id="multiplier">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="-24">y</EnumVal>
			<EnumVal ord="-21">z</EnumVal>
			<EnumVal ord="-18">a</EnumVal>
			<EnumVal ord="-15">f</EnumVal>
			<EnumVal ord="-12">p</EnumVal>
			<EnumVal ord="-9">n</EnumVal>
			<EnumVal ord="-6">µ</EnumVal>
			<EnumVal ord="-3">m</EnumVal>
			<EnumVal ord="-2">c</EnumVal>
			<EnumVal ord="-1">d</EnumVal>
			<EnumVal ord="0"></EnumVal>
			<EnumVal ord="1">da</EnumVal>
			<EnumVal ord="2">h</EnumVal>
			<EnumVal ord="3">k</EnumVal>
			<EnumVal ord="6">M</EnumVal>
			<EnumVal ord="9">G</EnumVal>
			<EnumVal ord="12">T</EnumVal>
			<EnumVal ord="15">P</EnumVal>
			<EnumVal ord="18">E</EnumVal>
			<EnumVal ord="21">Z</EnumVal>
			<EnumVal ord="24">Y</EnumVal>
		</EnumType>
		<EnumType id="SIUnit">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="1"></EnumVal>
			<EnumVal ord="2">m</EnumVal>
			<EnumVal ord="3">kg</EnumVal>
			<EnumVal ord="4">s</EnumVal>
			<EnumVal ord="5">A</EnumVal>
			<EnumVal ord="6">K</EnumVal>
			<EnumVal ord="7">mol</EnumVal>
			<EnumVal ord="8">cd</EnumVal>
			<EnumVal ord="9">deg</EnumVal>
			<EnumVal ord="10">rad</EnumVal>
			<EnumVal ord="11">sr</EnumVal>
			<EnumVal ord="21">Gy</EnumVal>
			<EnumVal ord="22">q</EnumVal>
			<EnumVal ord="23">°C</EnumVal>
			<EnumVal ord="24">Sv</EnumVal>
			<EnumVal ord="25">F</EnumVal>
			<EnumVal ord="26">C</EnumVal>
			<EnumVal ord="27">S</EnumVal>
			<EnumVal ord="28">H</EnumVal>
			<EnumVal ord="29">V</EnumVal>
			<EnumVal ord="30">ohm</EnumVal>
			<EnumVal ord="31">J</EnumVal>
			<EnumVal ord="32">N</EnumVal>
			<EnumVal ord="33">Hz</EnumVal>
			<EnumVal ord="34">lx</EnumVal>
			<EnumVal ord="35">Lm</EnumVal>
			<EnumVal ord="36">Wb</EnumVal>
			<EnumVal ord="37">T</EnumVal>
			<EnumVal ord="38">W</EnumVal>
			<EnumVal ord="39">Pa</EnumVal>
			<EnumVal ord="41">m²</EnumVal>
			<EnumVal ord="42">m³</EnumVal>
			<EnumVal ord="43">m/s</EnumVal>
			<EnumVal ord="44">m/s²</EnumVal>
			<EnumVal ord="45">m³/s</EnumVal>
			<EnumVal ord="46">m/m³</EnumVal>
			<EnumVal ord="47">M</EnumVal>
			<EnumVal ord="48">kg/m³</EnumVal>
			<EnumVal ord="49">m²/s</EnumVal>
			<EnumVal ord="50">W/m K</EnumVal>
			<EnumVal ord="51">J/K</EnumVal>
			<EnumVal ord="52">ppm</EnumVal>
			<EnumVal ord="53">1/s</EnumVal>
			<EnumVal ord="54">rad/s</EnumVal>
			<EnumVal ord="61">VA</EnumVal>
			<EnumVal ord="62">Watts</EnumVal>
			<EnumVal ord="63">VAr</EnumVal>
			<EnumVal ord="64">phi</EnumVal>
			<EnumVal ord="65">cos(phi)</EnumVal>
			<EnumVal ord="66">Vs</EnumVal>
			<EnumVal ord="67">V²</EnumVal>
			<EnumVal ord="68">As</EnumVal>
			<EnumVal ord="69">A²</EnumVal>
			<EnumVal ord="70">A²t</EnumVal>
			<EnumVal ord="71">VAh</EnumVal>
			<EnumVal ord="72">Wh</EnumVal>
			<EnumVal ord="73">VArh</EnumVal>
			<EnumVal ord="74">V/Hz</EnumVal>
		</EnumType>
		<EnumType id="Beh">
			<!--Source: IEC 61850-7-4:2003-->
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
		<EnumType id="Health">
			<!--Source: IEC 61850-7-4:2003-->
			<EnumVal ord="1">Ok</EnumVal>
			<EnumVal ord="2">Warning</EnumVal>
			<EnumVal ord="3">Alarm</EnumVal>
		</EnumType>
		<EnumType id="Mod">
			<!--Source: IEC 61850-7-4:2003-->
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
	</DataTypeTemplates>
</SCL>

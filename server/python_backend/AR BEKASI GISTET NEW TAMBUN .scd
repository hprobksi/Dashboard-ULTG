<?xml version="1.0" encoding="UTF-8"?>
<!--Created by rhard with OMICRON IEDScout 4.20 licensed to -->
<!--SCL Schema Version 3.1 (2012/10/22)-->
<SCL version="2007" revision="B" xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.iec.ch/61850/2003/SCL SCL.xsd">
	<Header id="" version="" revision="" toolID="OMICRON IEDScout" nameStructure="IEDName" />
	<Communication>
		<SubNetwork name="NONE" type="8-MMS">
			<ConnectedAP iedName="B1R4F791" apName="P1">
				<Address>
					<P type="IP" xsi:type="tP_IP">172.20.121.17</P>
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
	<IED name="B1R4F791">
		<Services>
			<DynAssociation />
			<GetDirectory />
			<GetDataObjectDefinition />
			<DataObjectDirectory />
			<GetDataSetValue />
			<SetDataSetValue />
			<DataSetDirectory />
			<ConfDataSet max="0" modify="false" />
			<DynDataSet max="42" />
			<ReadWrite />
			<SettingGroups>
				<SGEdit />
				<ConfSG />
			</SettingGroups>
			<ConfReportControl max="55" bufConf="false" />
			<GetCBValues />
			<ReportSettings rptID="Dyn" optFields="Dyn" bufTime="Dyn" trgOps="Dyn" intgPd="Dyn" owner="true" resvTms="true" />
			<ConfLNs fixPrefix="true" fixLnInst="true" />
			<GOOSE max="0" />
			<GSSE max="0" />
			<FileHandling />
		</Services>
		<AccessPoint name="P1">
			<Server>
				<Authentication none="true" />
				<LDevice inst="Application">
					<LN0 lnType="B1R4F791Application.LLN0" lnClass="LLN0" inst="">
						<ReportControl name="A_URCB" rptID="B1R4F791Application/LLN0$RP$A_URCB" buffered="false" bufTime="100" intgPd="10800000" confRev="14">
							<TrgOps dchg="true" qchg="true" dupd="true" period="true" gi="true" />
							<OptFields seqNum="true" timeStamp="false" dataSet="false" reasonCode="true" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_1" rptID="B1R4F791Application/LLN0$RP$A_URCB_1" buffered="false" bufTime="100" intgPd="10800000" confRev="17">
							<TrgOps dchg="true" qchg="true" dupd="true" period="true" gi="true" />
							<OptFields seqNum="true" timeStamp="false" dataSet="false" reasonCode="true" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_2" rptID="B1R4F791Application/LLN0$RP$A_URCB_2" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_3" rptID="B1R4F791Application/LLN0$RP$A_URCB_3" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_4" rptID="B1R4F791Application/LLN0$RP$A_URCB_4" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_5" rptID="B1R4F791Application/LLN0$RP$A_URCB_5" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_6" rptID="B1R4F791Application/LLN0$RP$A_URCB_6" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_7" rptID="B1R4F791Application/LLN0$RP$A_URCB_7" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_8" rptID="B1R4F791Application/LLN0$RP$A_URCB_8" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_9" rptID="B1R4F791Application/LLN0$RP$A_URCB_9" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_10" rptID="B1R4F791Application/LLN0$RP$A_URCB_10" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_11" rptID="B1R4F791Application/LLN0$RP$A_URCB_11" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_12" rptID="B1R4F791Application/LLN0$RP$A_URCB_12" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_13" rptID="B1R4F791Application/LLN0$RP$A_URCB_13" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_14" rptID="B1R4F791Application/LLN0$RP$A_URCB_14" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_15" rptID="B1R4F791Application/LLN0$RP$A_URCB_15" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_16" rptID="B1R4F791Application/LLN0$RP$A_URCB_16" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_17" rptID="B1R4F791Application/LLN0$RP$A_URCB_17" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_18" rptID="B1R4F791Application/LLN0$RP$A_URCB_18" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_19" rptID="B1R4F791Application/LLN0$RP$A_URCB_19" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_20" rptID="B1R4F791Application/LLN0$RP$A_URCB_20" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_21" rptID="B1R4F791Application/LLN0$RP$A_URCB_21" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_22" rptID="B1R4F791Application/LLN0$RP$A_URCB_22" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_23" rptID="B1R4F791Application/LLN0$RP$A_URCB_23" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_24" rptID="B1R4F791Application/LLN0$RP$A_URCB_24" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_25" rptID="B1R4F791Application/LLN0$RP$A_URCB_25" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_26" rptID="B1R4F791Application/LLN0$RP$A_URCB_26" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_27" rptID="B1R4F791Application/LLN0$RP$A_URCB_27" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_28" rptID="B1R4F791Application/LLN0$RP$A_URCB_28" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_URCB_29" rptID="B1R4F791Application/LLN0$RP$A_URCB_29" buffered="false" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB" rptID="B1R4F791Application/LLN0$BR$A_BRCB" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_1" rptID="B1R4F791Application/LLN0$BR$A_BRCB_1" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_2" rptID="B1R4F791Application/LLN0$BR$A_BRCB_2" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_3" rptID="B1R4F791Application/LLN0$BR$A_BRCB_3" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_4" rptID="B1R4F791Application/LLN0$BR$A_BRCB_4" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_5" rptID="B1R4F791Application/LLN0$BR$A_BRCB_5" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_6" rptID="B1R4F791Application/LLN0$BR$A_BRCB_6" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_7" rptID="B1R4F791Application/LLN0$BR$A_BRCB_7" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_8" rptID="B1R4F791Application/LLN0$BR$A_BRCB_8" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_9" rptID="B1R4F791Application/LLN0$BR$A_BRCB_9" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_10" rptID="B1R4F791Application/LLN0$BR$A_BRCB_10" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_11" rptID="B1R4F791Application/LLN0$BR$A_BRCB_11" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_12" rptID="B1R4F791Application/LLN0$BR$A_BRCB_12" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_13" rptID="B1R4F791Application/LLN0$BR$A_BRCB_13" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_14" rptID="B1R4F791Application/LLN0$BR$A_BRCB_14" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_15" rptID="B1R4F791Application/LLN0$BR$A_BRCB_15" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_16" rptID="B1R4F791Application/LLN0$BR$A_BRCB_16" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_17" rptID="B1R4F791Application/LLN0$BR$A_BRCB_17" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_18" rptID="B1R4F791Application/LLN0$BR$A_BRCB_18" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_19" rptID="B1R4F791Application/LLN0$BR$A_BRCB_19" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_20" rptID="B1R4F791Application/LLN0$BR$A_BRCB_20" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_21" rptID="B1R4F791Application/LLN0$BR$A_BRCB_21" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_22" rptID="B1R4F791Application/LLN0$BR$A_BRCB_22" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_23" rptID="B1R4F791Application/LLN0$BR$A_BRCB_23" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<ReportControl name="A_BRCB_24" rptID="B1R4F791Application/LLN0$BR$A_BRCB_24" buffered="true" bufTime="0" intgPd="0" confRev="1">
							<TrgOps dchg="false" qchg="false" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="1" />
						</ReportControl>
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="LEDRs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
						<SettingControl numOfSGs="1" actSG="1" />
					</LN0>
					<LN lnType="B1R4F791Application.CALH0" lnClass="CALH" inst="0">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.CFCGAPC1" prefix="CFC" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
						<DOI name="SPS">
							<DAI name="dataNs">
								<Val>Siprotec5/user-defined</Val>
							</DAI>
						</DOI>
						<DOI name="SPS1">
							<DAI name="dataNs">
								<Val>Siprotec5/user-defined</Val>
							</DAI>
						</DOI>
						<DOI name="SPS2">
							<DAI name="dataNs">
								<Val>Siprotec5/user-defined</Val>
							</DAI>
						</DOI>
						<DOI name="SPS3">
							<DAI name="dataNs">
								<Val>Siprotec5/user-defined</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.LPHD0" lnClass="LPHD" inst="0">
						<DOI name="PhyNam">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="hwRev">
								<Val>7SL87-DAAA-AA0-0AAAA0-AQ1111-12111B-BAW000-000AC0-CH1BA1-CH1CE0</Val>
							</DAI>
							<DAI name="swRev">
								<Val>V07.80</Val>
							</DAI>
							<DAI name="serNum">
								<Val>BM1801010445</Val>
							</DAI>
							<DAI name="model">
								<Val>7SL87</Val>
							</DAI>
							<DAI name="location">
								<Val></Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.LTIM0" lnClass="LTIM" inst="0">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="TmOfsTmm">
							<DAI name="minVal">
								<Val>-720</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>840</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>15</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="TmUseDT">
							<DAI name="setVal" />
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.LTRK0" lnClass="LTRK" inst="0">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="RSLED" lnClass="GAPC" inst="0">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="CB1">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="CBT_" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.CILO1" lnClass="CILO" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.CSWI1" lnClass="CSWI" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Pos">
							<DAI name="ctlModel">
								<Val>sbo-with-enhanced-security</Val>
							</DAI>
							<DAI name="sboTimeout">
								<Val>30000</Val>
							</DAI>
						</DOI>
						<DOI name="SPS">
							<DAI name="dataNs">
								<Val>Siprotec5/user-defined</Val>
							</DAI>
						</DOI>
						<DOI name="SPC">
							<SDI name="pulseConfig">
								<DAI name="cmdQual">
									<Val>pulse</Val>
								</DAI>
								<DAI name="onDur">
									<Val>200</Val>
								</DAI>
								<DAI name="offDur">
									<Val>10</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="sboTimeout">
								<Val>10000</Val>
							</DAI>
							<DAI name="sboClass">
								<Val>operate-once</Val>
							</DAI>
							<DAI name="dataNs">
								<Val>Siprotec5/user-defined</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.GAPC2" lnClass="GAPC" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.PTRC1" lnClass="PTRC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="RSLED" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.XCBR1" lnClass="XCBR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Pos">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkOpn">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkCls">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="SumSwARs">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>1.0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.XCBR1" lnClass="XCBR" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Pos">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkOpn">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkCls">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="SumSwARs">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>1.0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.XCBR1" lnClass="XCBR" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Pos">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkOpn">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkCls">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="SumSwARs">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>1.0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.XCBR4" lnClass="XCBR" inst="4">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Pos">
							<SDI name="pulseConfig">
								<DAI name="cmdQual">
									<Val>pulse</Val>
								</DAI>
								<DAI name="onDur">
									<Val>100</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkOpn">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkCls">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="SumSwARs">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>0.001</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="CB1_25Synchronization">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791CB1_25Synchronization.CK_RSYN1" prefix="CK_" lnClass="RSYN" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="SynPrg">
							<DAI name="ctlModel">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="InProgress">
							<DAI name="dataNs">
								<Val>SIPROTEC5</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1_25Synchronization.GENRSYN1" prefix="GEN" lnClass="RSYN" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="DifVClc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>V</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>2000</Val>
							</DAI>
						</DOI>
						<DOI name="DifHzClc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>Hz</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>100</Val>
							</DAI>
						</DOI>
						<DOI name="DifAngClc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>1000</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1_25Synchronization.SYAS_RSYN1" prefix="SYAS_" lnClass="RSYN" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="SynPrg">
							<DAI name="ctlModel">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="CB1_79AutoReclosing">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791CB1_79AutoReclosing.CYC_RREC1" prefix="CYC_" lnClass="RREC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1_79AutoReclosing.GEN_RREC1" prefix="GEN_" lnClass="RREC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
						<DOI name="Blk1polCyc">
							<DAI name="dataNs">
								<Val>SIPROTEC5</Val>
							</DAI>
						</DOI>
						<DOI name="Blk3polCyc">
							<DAI name="dataNs">
								<Val>SIPROTEC5</Val>
							</DAI>
						</DOI>
						<DOI name="NotRdy">
							<DAI name="dataNs">
								<Val>SIPROTEC5</Val>
							</DAI>
						</DOI>
						<DOI name="RecInit">
							<DAI name="dataNs">
								<Val>SIPROTEC5</Val>
							</DAI>
						</DOI>
						<DOI name="SPS">
							<DAI name="dataNs">
								<Val>Siprotec5/user-defined</Val>
							</DAI>
						</DOI>
						<DOI name="SPS1">
							<DAI name="dataNs">
								<Val>Siprotec5/user-defined</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="CB1_Fundamental">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791CB1_Fundamental.FPRE_MMXU1" prefix="FPRE_" lnClass="MMXU" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="PPV">
							<SDI name="phsAB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsBC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsCA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="PhV">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="res">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>20000</Val>
								</DAI>
							</SDI>
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
								<DAI name="db">
									<Val>10000</Val>
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
								<DAI name="db">
									<Val>10000</Val>
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
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="res">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>100000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="CB2">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="CBT_" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.CILO1" lnClass="CILO" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB2.CSWI1" lnClass="CSWI" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Pos">
							<DAI name="ctlModel">
								<Val>sbo-with-enhanced-security</Val>
							</DAI>
							<DAI name="sboTimeout">
								<Val>30000</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.GAPC2" lnClass="GAPC" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.PTRC1" lnClass="PTRC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="RSLED" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.XCBR1" lnClass="XCBR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Pos">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkOpn">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkCls">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="SumSwARs">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>1.0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.XCBR1" lnClass="XCBR" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Pos">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkOpn">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkCls">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="SumSwARs">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>1.0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.XCBR1" lnClass="XCBR" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Pos">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkOpn">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkCls">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="SumSwARs">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>1.0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1.XCBR4" lnClass="XCBR" inst="4">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Pos">
							<SDI name="pulseConfig">
								<DAI name="cmdQual">
									<Val>pulse</Val>
								</DAI>
								<DAI name="onDur">
									<Val>100</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkOpn">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="BlkCls">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="SumSwARs">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>0.001</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="CB2_25Synchronization">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791CB1_25Synchronization.CK_RSYN1" prefix="CK_" lnClass="RSYN" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="SynPrg">
							<DAI name="ctlModel">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="InProgress">
							<DAI name="dataNs">
								<Val>SIPROTEC5</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1_25Synchronization.GENRSYN1" prefix="GEN" lnClass="RSYN" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="DifVClc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>V</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>2000</Val>
							</DAI>
						</DOI>
						<DOI name="DifHzClc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>Hz</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>100</Val>
							</DAI>
						</DOI>
						<DOI name="DifAngClc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>1000</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1_25Synchronization.SYAS_RSYN1" prefix="SYAS_" lnClass="RSYN" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="SynPrg">
							<DAI name="ctlModel">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="CB2_79AutoReclosing">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791CB1_79AutoReclosing.CYC_RREC1" prefix="CYC_" lnClass="RREC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1_79AutoReclosing.GEN_RREC1" prefix="GEN_" lnClass="RREC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
						<DOI name="Blk1polCyc">
							<DAI name="dataNs">
								<Val>SIPROTEC5</Val>
							</DAI>
						</DOI>
						<DOI name="Blk3polCyc">
							<DAI name="dataNs">
								<Val>SIPROTEC5</Val>
							</DAI>
						</DOI>
						<DOI name="NotRdy">
							<DAI name="dataNs">
								<Val>SIPROTEC5</Val>
							</DAI>
						</DOI>
						<DOI name="RecInit">
							<DAI name="dataNs">
								<Val>SIPROTEC5</Val>
							</DAI>
						</DOI>
						<DOI name="SPS">
							<DAI name="dataNs">
								<Val>Siprotec5/user-defined</Val>
							</DAI>
						</DOI>
						<DOI name="SPS1">
							<DAI name="dataNs">
								<Val>Siprotec5/user-defined</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="CB2_Fundamental">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791CB1_Fundamental.FPRE_MMXU1" prefix="FPRE_" lnClass="MMXU" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="PPV">
							<SDI name="phsAB">
								<SDI name="units">
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsBC">
								<SDI name="units">
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsCA">
								<SDI name="units">
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="PhV">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="res">
								<SDI name="units">
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>20000</Val>
								</DAI>
							</SDI>
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
								<DAI name="db">
									<Val>10000</Val>
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
								<DAI name="db">
									<Val>10000</Val>
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
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="res">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>100000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="Ln1">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Ln1.PTRC1" lnClass="PTRC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="RSLED" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1.SE_RFLO1" prefix="SE_" lnClass="RFLO" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="FltZ">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>ohm</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1.ZLIN1" lnClass="ZLIN" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="Ln1_5051NOCgndA1">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 10:16:00</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791CB1.GAPC2" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 10:16:00</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1_5051NOCgndA1.ND_PTOC1" prefix="ND_" lnClass="PTOC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 10:16:00</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1_5051NOCgndA1.ND_PTOC1" prefix="ND_" lnClass="PTOC" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 10:16:00</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1_5051NOCgndA1.PTRC1" lnClass="PTRC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 10:16:00</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="Ln1_5051OC3ph1p1">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 10:16:00</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791CB1.GAPC2" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 10:16:00</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1_5051OC3ph1p1.ID_PTOC1" prefix="ID_" lnClass="PTOC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 10:16:00</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1_5051OC3ph1p1.ID_PTOC1" prefix="ID_" lnClass="PTOC" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 10:16:00</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1_5051OC3ph1p1.PTRC1" lnClass="PTRC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 10:16:00</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="Ln1_Energy">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Ln1_Energy.XPRE_MMTR1" prefix="XPRE_" lnClass="MMTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="SupWh">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>Wh</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>M</Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>0.029</Val>
							</DAI>
							<DAI name="frEna">
								<Val>0</Val>
							</DAI>
							<DAI name="frPd">
								<Val>0</Val>
							</DAI>
							<DAI name="frRs">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="SupVArh">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VArh</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>M</Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>0.029</Val>
							</DAI>
							<DAI name="frEna">
								<Val>0</Val>
							</DAI>
							<DAI name="frPd">
								<Val>0</Val>
							</DAI>
							<DAI name="frRs">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="DmdWh">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>Wh</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>M</Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>0.029</Val>
							</DAI>
							<DAI name="frEna">
								<Val>0</Val>
							</DAI>
							<DAI name="frPd">
								<Val>0</Val>
							</DAI>
							<DAI name="frRs">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="DmdVArh">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VArh</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>M</Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>0.029</Val>
							</DAI>
							<DAI name="frEna">
								<Val>0</Val>
							</DAI>
							<DAI name="frPd">
								<Val>0</Val>
							</DAI>
							<DAI name="frRs">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="Ln1_ExternalTrip1pole1">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 05:31:29</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Ln1_ExternalTrip1pole1.EXTP_PSCH1" prefix="EXTP_" lnClass="PSCH" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-10 05:31:29</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="dataNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="Ln1_FundSymComp">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Ln1_FundSymComp.FPRE_MMXN1" prefix="FPRE_" lnClass="MMXN" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791CB1_Fundamental.FPRE_MMXU1" prefix="FPRE_" lnClass="MMXU" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="PPV">
							<SDI name="phsAB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsBC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsCA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="PhV">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="res">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>20000</Val>
								</DAI>
							</SDI>
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
								<DAI name="db">
									<Val>10000</Val>
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
								<DAI name="db">
									<Val>10000</Val>
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
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="res">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>100000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1_FundSymComp.XPRE_MSQI1" prefix="XPRE_" lnClass="MSQI" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="SeqA">
							<SDI name="c1">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="c2">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="c3">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="SeqV">
							<SDI name="c1">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="c2">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="c3">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="Ln1_OperationalValues">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Ln1_OperationalValues.PPRE_MMXU1" prefix="PPRE_" lnClass="MMXU" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="TotW">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>W</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>M</Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>10000</Val>
							</DAI>
						</DOI>
						<DOI name="TotVAr">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VAr</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>M</Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>10000</Val>
							</DAI>
						</DOI>
						<DOI name="TotVA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VA</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>M</Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>10000</Val>
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
							<DAI name="db">
								<Val>10000</Val>
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
							<DAI name="db">
								<Val>100</Val>
							</DAI>
						</DOI>
						<DOI name="W">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>W</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>M</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>W</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>M</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>W</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>M</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VAr">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VAr</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>M</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VAr</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>M</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VAr</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>M</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VA">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VA</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>M</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VA</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>M</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>VA</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>M</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1_FundSymComp.FPRE_MMXN1" prefix="RPRE_" lnClass="MMXN" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Ln1_OperationalValues.RPRE_MMXU1" prefix="RPRE_" lnClass="MMXU" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="PPV">
							<SDI name="phsAB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsBC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsCA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="PhV">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsB">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="phsC">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2000</Val>
								</DAI>
							</SDI>
							<SDI name="res">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>V</Val>
									</DAI>
									<DAI name="multiplier">
										<Val>k</Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>20000</Val>
								</DAI>
							</SDI>
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
								<DAI name="db">
									<Val>10000</Val>
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
								<DAI name="db">
									<Val>10000</Val>
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
								<DAI name="db">
									<Val>10000</Val>
								</DAI>
							</SDI>
							<SDI name="res">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val>A</Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>100000</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="Ln1_ProcessMonitor">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
				</LDevice>
				<LDevice inst="Mod3">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
				</LDevice>
				<LDevice inst="Mod3_Channel1">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Mod3_Channel1.LCCH1" lnClass="LCCH" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.13.995</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Mod3_Channel1.LCCH1" lnClass="LCCH" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.13.995</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Mod3_Channel1.LCCH1" lnClass="LCCH" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.16.995</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Mod3_Channel1.LCCH1" prefix="Line_" lnClass="LCCH" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.13.995</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="PowS">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="PowS_MeasPointI3ph1">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="CT3P_" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791PowS_MeasPointI3ph1.TCTR1" lnClass="TCTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791PowS_MeasPointI3ph1.TCTR1" lnClass="TCTR" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791PowS_MeasPointI3ph1.TCTR1" lnClass="TCTR" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791PowS_MeasPointI3ph1.TCTR1" lnClass="TCTR" inst="4">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="PowS_MeasPointV1ph">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" lnClass="GAPC" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791PowS_MeasPointV1ph.TVTR1" lnClass="TVTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791PowS_MeasPointV1ph.TVTR1" lnClass="TVTR" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="PowS_MeasPointV3ph1">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791PowS_MeasPointV1ph.TVTR1" lnClass="TVTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791PowS_MeasPointV1ph.TVTR1" lnClass="TVTR" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791PowS_MeasPointV1ph.TVTR1" lnClass="TVTR" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791PowS_MeasPointV1ph.TVTR1" lnClass="TVTR" inst="4">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="VT3P_" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="Rec">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="GFLG_" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="RCDG_" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="Rec_FaultRecorder">
					<LN0 lnType="B1R4F791CB1.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>05.07.80</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="B1R4F791Rec_FaultRecorder.DEF_RDRE1" prefix="DEF_" lnClass="RDRE" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="RcdTrg">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="MemRs">
							<DAI name="ctlModel">
								<Val>direct-with-enhanced-security</Val>
							</DAI>
						</DOI>
						<DOI name="MemClr">
							<DAI name="ctlModel">
								<Val>direct-with-enhanced-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="B1R4F791Application.RSLEDGAPC0" prefix="RCDR_" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>SIEMENS</Val>
							</DAI>
							<DAI name="swRev">
								<Val>07.80.00</Val>
							</DAI>
							<DAI name="d">
								<Val></Val>
							</DAI>
							<DAI name="configRev">
								<Val>2020-02-05 09:58:41</Val>
							</DAI>
							<DAI name="lnNs">
								<Val>IEC 61850-7-4:2007</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
			</Server>
		</AccessPoint>
	</IED>
	<DataTypeTemplates>
		<LNodeType id="B1R4F791Application.LLN0" lnClass="LLN0">
			<DO name="Mod" type="B1R4F791Application.LLN0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="LEDRs" type="B1R4F791Application.LLN0.LEDRs" />
			<DO name="NamPlt" type="B1R4F791Application.LLN0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1.LLN0" lnClass="LLN0">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="NamPlt" type="B1R4F791Application.LLN0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Application.LPHD0" lnClass="LPHD">
			<DO name="PhyHealth" type="B1R4F791Application.LLN0.Health" />
			<DO name="Proxy" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="PwrUp" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="PhyNam" type="B1R4F791Application.LPHD0.PhyNam" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1_Energy.XPRE_MMTR1" lnClass="MMTR">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="SupWh" type="B1R4F791Ln1_Energy.XPRE_MMTR1.SupWh" />
			<DO name="SupVArh" type="B1R4F791Ln1_Energy.XPRE_MMTR1.SupWh" />
			<DO name="DmdWh" type="B1R4F791Ln1_Energy.XPRE_MMTR1.SupWh" />
			<DO name="DmdVArh" type="B1R4F791Ln1_Energy.XPRE_MMTR1.SupWh" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1_FundSymComp.FPRE_MMXN1" lnClass="MMXN">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1_Fundamental.FPRE_MMXU1" lnClass="MMXU">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="PPV" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV" />
			<DO name="PhV" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PhV" />
			<DO name="A" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PhV" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1_OperationalValues.PPRE_MMXU1" lnClass="MMXU">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="TotW" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.TotW" />
			<DO name="TotVAr" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.TotW" />
			<DO name="TotVA" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.TotW" />
			<DO name="TotPF" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.TotW" />
			<DO name="Hz" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.TotW" />
			<DO name="W" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W" />
			<DO name="VAr" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W" />
			<DO name="VA" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1_OperationalValues.RPRE_MMXU1" lnClass="MMXU">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="PPV" type="B1R4F791Ln1_OperationalValues.RPRE_MMXU1.PPV" />
			<DO name="PhV" type="B1R4F791Ln1_OperationalValues.RPRE_MMXU1.PhV" />
			<DO name="A" type="B1R4F791Ln1_OperationalValues.RPRE_MMXU1.PhV" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1_FundSymComp.XPRE_MSQI1" lnClass="MSQI">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="SeqA" type="B1R4F791Ln1_FundSymComp.XPRE_MSQI1.SeqA" />
			<DO name="SeqV" type="B1R4F791Ln1_FundSymComp.XPRE_MSQI1.SeqA" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1_5051NOCgndA1.ND_PTOC1" lnClass="PTOC">
			<DO name="Mod" type="B1R4F791Application.LLN0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="Str" type="B1R4F791Ln1_5051NOCgndA1.ND_PTOC1.Str" />
			<DO name="Op" type="B1R4F791Ln1_5051NOCgndA1.ND_PTOC1.Op" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1_5051OC3ph1p1.ID_PTOC1" lnClass="PTOC">
			<DO name="Mod" type="B1R4F791Application.LLN0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="Str" type="B1R4F791Ln1_5051OC3ph1p1.ID_PTOC1.Str" />
			<DO name="Op" type="B1R4F791CB1.PTRC1.Tr" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1.PTRC1" lnClass="PTRC">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="Tr" type="B1R4F791CB1.PTRC1.Tr" />
			<DO name="Op" type="B1R4F791CB1.PTRC1.Tr" />
			<DO name="Str" type="B1R4F791CB1.PTRC1.Str" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1.PTRC1" lnClass="PTRC">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="Op" type="B1R4F791CB1.PTRC1.Tr" />
			<DO name="Str" type="B1R4F791CB1.PTRC1.Str" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1_5051NOCgndA1.PTRC1" lnClass="PTRC">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="Op" type="B1R4F791Ln1_5051NOCgndA1.ND_PTOC1.Op" />
			<DO name="Str" type="B1R4F791Ln1_5051NOCgndA1.ND_PTOC1.Str" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1_5051OC3ph1p1.PTRC1" lnClass="PTRC">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="Op" type="B1R4F791CB1.PTRC1.Tr" />
			<DO name="Str" type="B1R4F791Ln1_5051OC3ph1p1.ID_PTOC1.Str" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Rec_FaultRecorder.DEF_RDRE1" lnClass="RDRE">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="RcdTrg" type="B1R4F791Application.LLN0.LEDRs" />
			<DO name="MemRs" type="B1R4F791Application.LLN0.LEDRs" />
			<DO name="MemClr" type="B1R4F791Application.LLN0.LEDRs" />
			<DO name="RcdMade" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="FltNum" type="B1R4F791Rec_FaultRecorder.DEF_RDRE1.FltNum" />
			<DO name="RcdStr" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1_25Synchronization.CK_RSYN1" lnClass="RSYN">
			<DO name="Mod" type="B1R4F791Application.LLN0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="Rel" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="VInd" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="AngInd" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="HzInd" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="SynPrg" type="B1R4F791CB1_25Synchronization.CK_RSYN1.SynPrg" />
			<DO name="InProgress" type="B1R4F791CB1_25Synchronization.CK_RSYN1.InProgress" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1_25Synchronization.SYAS_RSYN1" lnClass="RSYN">
			<DO name="Mod" type="B1R4F791Application.LLN0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="Rel" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="VInd" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="AngInd" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="HzInd" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="SynPrg" type="B1R4F791CB1_25Synchronization.CK_RSYN1.SynPrg" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Application.CALH0" lnClass="CALH">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="GrAlm" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="GrWrn" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1.CILO1" lnClass="CILO">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="EnaOpn" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="EnaCls" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1.CSWI1" lnClass="CSWI">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="Loc" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="Pos" type="B1R4F791CB1.CSWI1.Pos" />
			<DO name="SPS" type="B1R4F791CB1.CSWI1.SPS" />
			<DO name="SPC" type="B1R4F791CB1.CSWI1.SPC" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB2.CSWI1" lnClass="CSWI">
			<DO name="Mod" type="B1R4F791Application.CALH0.Mod" />
			<DO name="Beh" type="B1R4F791Application.LLN0.Beh" />
			<DO name="Health" type="B1R4F791Application.LLN0.Health" />
			<DO name="Loc" type="B1R4F791Application.CALH0.GrAlm" />
			<DO name="Pos" type="B1R4F791CB1.CSWI1.Pos" />
			<DO name="NamPlt" type="B1R4F791Application.CALH0.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Application.CFCGAPC1" lnClass="GAPC">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
			<DO name="SPS" type="B1R4F791Application.CFCGAPC1.SPS" />
			<DO name="SPS1" type="B1R4F791Application.CFCGAPC1.SPS" />
			<DO name="SPS2" type="B1R4F791Application.CFCGAPC1.SPS" />
			<DO name="SPS3" type="B1R4F791Application.CFCGAPC1.SPS" />
		</LNodeType>
		<LNodeType id="B1R4F791Application.RSLEDGAPC0" lnClass="GAPC">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1.GAPC2" lnClass="GAPC">
			<DO name="Mod" type="B1R4F791CB1.GAPC2.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Mod3_Channel1.LCCH1" lnClass="LCCH">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="ChLiv" type="B1R4F791Application.LTIM0.TmDT" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Application.LTIM0" lnClass="LTIM">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="TmDT" type="B1R4F791Application.LTIM0.TmDT" />
			<DO name="TmOfsTmm" type="B1R4F791Application.LTIM0.TmOfsTmm" />
			<DO name="TmUseDT" type="B1R4F791Application.LTIM0.TmUseDT" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Application.LTRK0" lnClass="LTRK">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1_ExternalTrip1pole1.EXTP_PSCH1" lnClass="PSCH">
			<DO name="Mod" type="B1R4F791CB1.GAPC2.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
			<DO name="Str" type="B1R4F791Ln1_ExternalTrip1pole1.EXTP_PSCH1.Str" />
			<DO name="Op" type="B1R4F791Ln1_ExternalTrip1pole1.EXTP_PSCH1.Op" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1.SE_RFLO1" lnClass="RFLO">
			<DO name="Mod" type="B1R4F791CB1.GAPC2.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="FltZ" type="B1R4F791Ln1.SE_RFLO1.FltZ" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="FltLoop" type="B1R4F791Ln1.SE_RFLO1.FltLoop" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1_79AutoReclosing.CYC_RREC1" lnClass="RREC">
			<DO name="Mod" type="B1R4F791CB1.GAPC2.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="AutoRecSt" type="B1R4F791CB1_79AutoReclosing.CYC_RREC1.AutoRecSt" />
			<DO name="OpCls" type="B1R4F791CB1_79AutoReclosing.CYC_RREC1.OpCls" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1_79AutoReclosing.GEN_RREC1" lnClass="RREC">
			<DO name="Mod" type="B1R4F791CB1.GAPC2.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="AutoRecSt" type="B1R4F791CB1_79AutoReclosing.CYC_RREC1.AutoRecSt" />
			<DO name="OpCls" type="B1R4F791CB1_79AutoReclosing.CYC_RREC1.OpCls" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
			<DO name="Blk1polCyc" type="B1R4F791Application.CFCGAPC1.SPS" />
			<DO name="Blk3polCyc" type="B1R4F791Application.CFCGAPC1.SPS" />
			<DO name="NotRdy" type="B1R4F791CB1_79AutoReclosing.GEN_RREC1.NotRdy" />
			<DO name="RecInit" type="B1R4F791CB1_79AutoReclosing.GEN_RREC1.NotRdy" />
			<DO name="SPS" type="B1R4F791Application.CFCGAPC1.SPS" />
			<DO name="SPS1" type="B1R4F791Application.CFCGAPC1.SPS" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1_25Synchronization.GENRSYN1" lnClass="RSYN">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="DifVClc" type="B1R4F791CB1_25Synchronization.GENRSYN1.DifVClc" />
			<DO name="DifHzClc" type="B1R4F791CB1_25Synchronization.GENRSYN1.DifVClc" />
			<DO name="DifAngClc" type="B1R4F791CB1_25Synchronization.GENRSYN1.DifVClc" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="Rel" type="B1R4F791Application.LTIM0.TmDT" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791PowS_MeasPointI3ph1.TCTR1" lnClass="TCTR">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791PowS_MeasPointV1ph.TVTR1" lnClass="TVTR">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1.XCBR1" lnClass="XCBR">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="Loc" type="B1R4F791Application.LTIM0.TmDT" />
			<DO name="OpCnt" type="B1R4F791CB1.XCBR1.OpCnt" />
			<DO name="Pos" type="B1R4F791CB1.XCBR1.Pos" />
			<DO name="BlkOpn" type="B1R4F791CB1.XCBR1.BlkOpn" />
			<DO name="BlkCls" type="B1R4F791CB1.XCBR1.BlkOpn" />
			<DO name="SumSwARs" type="B1R4F791CB1.XCBR1.SumSwARs" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791CB1.XCBR4" lnClass="XCBR">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="Loc" type="B1R4F791Application.LTIM0.TmDT" />
			<DO name="EEHealth" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="OpCnt" type="B1R4F791CB1.XCBR1.OpCnt" />
			<DO name="Pos" type="B1R4F791CB1.XCBR4.Pos" />
			<DO name="BlkOpn" type="B1R4F791CB1.XCBR1.BlkOpn" />
			<DO name="BlkCls" type="B1R4F791CB1.XCBR1.BlkOpn" />
			<DO name="SumSwARs" type="B1R4F791CB1.XCBR1.SumSwARs" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<LNodeType id="B1R4F791Ln1.ZLIN1" lnClass="ZLIN">
			<DO name="Mod" type="B1R4F791Application.CFCGAPC1.Mod" />
			<DO name="Beh" type="B1R4F791Application.CFCGAPC1.Beh" />
			<DO name="Health" type="B1R4F791Application.CFCGAPC1.Health" />
			<DO name="NamPlt" type="B1R4F791Application.CFCGAPC1.NamPlt" />
		</LNodeType>
		<DOType id="B1R4F791CB1.PTRC1.Str" cdc="ACD">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="dirGeneral" fc="ST" bType="Enum" type="dir" />
			<DA name="phsA" fc="ST" bType="BOOLEAN" />
			<DA name="dirPhsA" fc="ST" bType="Enum" type="dir" />
			<DA name="phsB" fc="ST" bType="BOOLEAN" />
			<DA name="dirPhsB" fc="ST" bType="Enum" type="dir" />
			<DA name="phsC" fc="ST" bType="BOOLEAN" />
			<DA name="dirPhsC" fc="ST" bType="Enum" type="dir" />
			<DA name="neut" fc="ST" bType="BOOLEAN" />
			<DA name="dirNeut" fc="ST" bType="Enum" type="dir" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Ln1_5051NOCgndA1.ND_PTOC1.Str" cdc="ACD">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="dirGeneral" fc="ST" bType="Enum" type="dir" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Ln1_5051OC3ph1p1.ID_PTOC1.Str" cdc="ACD">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="dirGeneral" fc="ST" bType="Enum" type="dir" />
			<DA name="phsA" fc="ST" bType="BOOLEAN" />
			<DA name="dirPhsA" fc="ST" bType="Enum" type="dir" />
			<DA name="phsB" fc="ST" bType="BOOLEAN" />
			<DA name="dirPhsB" fc="ST" bType="Enum" type="dir" />
			<DA name="phsC" fc="ST" bType="BOOLEAN" />
			<DA name="dirPhsC" fc="ST" bType="Enum" type="dir" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791CB1.PTRC1.Tr" cdc="ACT">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="phsA" fc="ST" bType="BOOLEAN" />
			<DA name="phsB" fc="ST" bType="BOOLEAN" />
			<DA name="phsC" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Ln1_5051NOCgndA1.ND_PTOC1.Op" cdc="ACT">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Ln1_Energy.XPRE_MMTR1.SupWh" cdc="BCR">
			<DA name="actVal" fc="ST" bType="INT32" />
			<DA name="frVal" fc="ST" bType="INT32" />
			<DA name="frTm" fc="ST" bType="Timestamp" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.units" />
			<DA name="pulsQty" fc="CF" bType="FLOAT32" />
			<DA name="frEna" fc="CF" bType="BOOLEAN" />
			<DA name="strTm" fc="CF" bType="Timestamp" />
			<DA name="frPd" fc="CF" bType="INT32" />
			<DA name="frRs" fc="CF" bType="BOOLEAN" />
		</DOType>
		<DOType id="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" cdc="CMV">
			<DA name="instCVal" fc="MX" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.instCVal" />
			<DA name="cVal" fc="MX" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.instCVal" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.units" />
			<DA name="db" fc="CF" bType="INT32U" />
		</DOType>
		<DOType id="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" cdc="CMV">
			<DA name="instCVal" fc="MX" bType="Struct" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA.instCVal" />
			<DA name="cVal" fc="MX" bType="Struct" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA.instCVal" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.units" />
			<DA name="db" fc="CF" bType="INT32U" />
		</DOType>
		<DOType id="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV" cdc="DEL">
			<SDO name="phsAB" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" />
			<SDO name="phsBC" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" />
			<SDO name="phsCA" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" />
		</DOType>
		<DOType id="B1R4F791Ln1_OperationalValues.RPRE_MMXU1.PPV" cdc="DEL">
			<SDO name="phsAB" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" />
			<SDO name="phsBC" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" />
			<SDO name="phsCA" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" />
		</DOType>
		<DOType id="B1R4F791CB1.CSWI1.Pos" cdc="DPC">
			<DA name="origin" fc="ST" bType="Struct" type="B1R4F791Application.LLN0.Mod.origin" />
			<DA name="ctlNum" fc="ST" bType="INT8U" />
			<DA name="stVal" fc="ST" bType="Dbpos" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="stSeld" fc="ST" bType="BOOLEAN" />
			<DA name="SBO" fc="CO" bType="ObjRef" />
			<DA name="SBOw" fc="CO" bType="Struct" type="B1R4F791Application.LLN0.LEDRs.Oper" />
			<DA name="Oper" fc="CO" bType="Struct" type="B1R4F791Application.LLN0.LEDRs.Oper" />
			<DA name="Cancel" fc="CO" bType="Struct" type="B1R4F791CB1.CSWI1.Pos.Cancel" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="sboTimeout" fc="CF" bType="INT32U" />
		</DOType>
		<DOType id="B1R4F791Application.LPHD0.PhyNam" cdc="DPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="hwRev" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="serNum" fc="DC" bType="VisString255" />
			<DA name="model" fc="DC" bType="VisString255" />
			<DA name="location" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="B1R4F791Application.LLN0.Mod" cdc="INC">
			<DA name="origin" fc="ST" bType="Struct" type="B1R4F791Application.LLN0.Mod.origin" />
			<DA name="ctlNum" fc="ST" bType="INT8U" />
			<DA name="stVal" fc="ST" bType="Enum" type="Mod" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="B1R4F791Application.LLN0.Mod.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
		</DOType>
		<DOType id="B1R4F791Application.CALH0.Mod" cdc="INC">
			<DA name="stVal" fc="ST" bType="Enum" type="Mod" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
		</DOType>
		<DOType id="B1R4F791Application.LLN0.Beh" cdc="INS">
			<DA name="stVal" fc="ST" bType="Enum" type="Beh" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Application.LLN0.Health" cdc="INS">
			<DA name="stVal" fc="ST" bType="Enum" type="Health" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Rec_FaultRecorder.DEF_RDRE1.FltNum" cdc="INS">
			<DA name="stVal" fc="ST" bType="INT32" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Application.LLN0.NamPlt" cdc="LPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="configRev" fc="DC" bType="VisString255" />
			<DA name="ldNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="B1R4F791Application.CALH0.NamPlt" cdc="LPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="configRev" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.TotW" cdc="MV">
			<DA name="instMag" fc="MX" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.instCVal.mag" />
			<DA name="mag" fc="MX" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.instCVal.mag" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.units" />
			<DA name="db" fc="CF" bType="INT32U" />
		</DOType>
		<DOType id="B1R4F791Ln1_FundSymComp.XPRE_MSQI1.SeqA" cdc="SEQ">
			<SDO name="c1" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" />
			<SDO name="c2" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" />
			<SDO name="c3" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" />
			<DA name="seqT" fc="MX" bType="Enum" type="seqT" />
		</DOType>
		<DOType id="B1R4F791Application.LLN0.LEDRs" cdc="SPC">
			<DA name="origin" fc="ST" bType="Struct" type="B1R4F791Application.LLN0.Mod.origin" />
			<DA name="ctlNum" fc="ST" bType="INT8U" />
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="B1R4F791Application.LLN0.LEDRs.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
		</DOType>
		<DOType id="B1R4F791CB1.CSWI1.SPC" cdc="SPC">
			<DA name="origin" fc="ST" bType="Struct" type="B1R4F791Application.LLN0.Mod.origin" />
			<DA name="ctlNum" fc="ST" bType="INT8U" />
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="stSeld" fc="ST" bType="BOOLEAN" />
			<DA name="SBO" fc="CO" bType="ObjRef" />
			<DA name="SBOw" fc="CO" bType="Struct" type="B1R4F791Application.LLN0.LEDRs.Oper" />
			<DA name="Oper" fc="CO" bType="Struct" type="B1R4F791Application.LLN0.LEDRs.Oper" />
			<DA name="Cancel" fc="CO" bType="Struct" type="B1R4F791CB1.CSWI1.Pos.Cancel" />
			<DA name="pulseConfig" fc="CF" bType="Struct" type="B1R4F791CB1.CSWI1.SPC.pulseConfig" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="sboTimeout" fc="CF" bType="INT32U" />
			<DA name="sboClass" fc="CF" bType="Enum" type="sboClass" />
			<DA name="subEna" fc="SV" bType="BOOLEAN" />
			<DA name="subVal" fc="SV" bType="BOOLEAN" />
			<DA name="subQ" fc="SV" bType="Quality" />
			<DA name="subID" fc="SV" bType="VisString64" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="B1R4F791Application.CALH0.GrAlm" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791CB1.CSWI1.SPS" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="subEna" fc="SV" bType="BOOLEAN" />
			<DA name="subVal" fc="SV" bType="BOOLEAN" />
			<DA name="subQ" fc="SV" bType="Quality" />
			<DA name="subID" fc="SV" bType="VisString64" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="B1R4F791CB1_25Synchronization.CK_RSYN1.SynPrg" cdc="SPS">
			<DA name="origin" fc="ST" bType="Struct" type="B1R4F791Application.LLN0.Mod.origin" />
			<DA name="ctlNum" fc="ST" bType="INT8U" />
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="B1R4F791Application.LLN0.LEDRs.Oper" />
			<DA name="ctlModel" fc="CF" bType="INT8" />
		</DOType>
		<DOType id="B1R4F791CB1_25Synchronization.CK_RSYN1.InProgress" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="B1R4F791CB1_Fundamental.FPRE_MMXU1.PhV" cdc="WYE">
			<SDO name="phsA" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" />
			<SDO name="phsB" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" />
			<SDO name="phsC" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" />
			<SDO name="res" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB" />
		</DOType>
		<DOType id="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W" cdc="WYE">
			<SDO name="phsA" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" />
			<SDO name="phsB" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" />
			<SDO name="phsC" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" />
		</DOType>
		<DOType id="B1R4F791Ln1_OperationalValues.RPRE_MMXU1.PhV" cdc="WYE">
			<SDO name="phsA" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" />
			<SDO name="phsB" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" />
			<SDO name="phsC" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" />
			<SDO name="res" type="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA" />
		</DOType>
		<DOType id="B1R4F791Ln1_ExternalTrip1pole1.EXTP_PSCH1.Str" cdc="ACD">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="dirGeneral" fc="ST" bType="Enum" type="FaultDirectionKind" />
			<DA name="phsA" fc="ST" bType="BOOLEAN" />
			<DA name="dirPhsA" fc="ST" bType="Enum" type="PhaseFaultDirectionKind" />
			<DA name="phsB" fc="ST" bType="BOOLEAN" />
			<DA name="dirPhsB" fc="ST" bType="Enum" type="PhaseFaultDirectionKind" />
			<DA name="phsC" fc="ST" bType="BOOLEAN" />
			<DA name="dirPhsC" fc="ST" bType="Enum" type="PhaseFaultDirectionKind" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="B1R4F791CB1_79AutoReclosing.CYC_RREC1.OpCls" cdc="ACT">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Ln1_ExternalTrip1pole1.EXTP_PSCH1.Op" cdc="ACT">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="phsA" fc="ST" bType="BOOLEAN" />
			<DA name="phsB" fc="ST" bType="BOOLEAN" />
			<DA name="phsC" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791CB1.XCBR1.SumSwARs" cdc="BCR">
			<DA name="actVal" fc="ST" bType="INT32" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="B1R4F791CB1.XCBR1.SumSwARs.units" />
			<DA name="pulsQty" fc="CF" bType="FLOAT32" />
		</DOType>
		<DOType id="B1R4F791Ln1.SE_RFLO1.FltZ" cdc="CMV">
			<DA name="instCVal" fc="MX" bType="Struct" type="B1R4F791Ln1.SE_RFLO1.FltZ.instCVal" />
			<DA name="cVal" fc="MX" bType="Struct" type="B1R4F791Ln1.SE_RFLO1.FltZ.instCVal" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="B1R4F791CB1.XCBR1.SumSwARs.units" />
		</DOType>
		<DOType id="B1R4F791CB1.XCBR1.Pos" cdc="DPC">
			<DA name="origin" fc="ST" bType="Struct" type="B1R4F791CB1.GAPC2.Mod.origin" />
			<DA name="ctlNum" fc="ST" bType="INT8U" />
			<DA name="stVal" fc="ST" bType="Dbpos" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="CtlModelKind" />
			<DA name="subEna" fc="SV" bType="BOOLEAN" />
			<DA name="subVal" fc="SV" bType="Dbpos" />
			<DA name="subQ" fc="SV" bType="Quality" />
			<DA name="subID" fc="SV" bType="VisString64" />
		</DOType>
		<DOType id="B1R4F791CB1.XCBR4.Pos" cdc="DPC">
			<DA name="origin" fc="ST" bType="Struct" type="B1R4F791CB1.GAPC2.Mod.origin" />
			<DA name="ctlNum" fc="ST" bType="INT8U" />
			<DA name="stVal" fc="ST" bType="Dbpos" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="stSeld" fc="ST" bType="BOOLEAN" />
			<DA name="pulseConfig" fc="CF" bType="Struct" type="B1R4F791CB1.XCBR4.Pos.pulseConfig" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="CtlModelKind" />
			<DA name="subEna" fc="SV" bType="BOOLEAN" />
			<DA name="subVal" fc="SV" bType="Dbpos" />
			<DA name="subQ" fc="SV" bType="Quality" />
			<DA name="subID" fc="SV" bType="VisString64" />
		</DOType>
		<DOType id="B1R4F791Application.CFCGAPC1.Mod" cdc="ENC">
			<DA name="stVal" fc="ST" bType="Enum" type="B1R4F791Application.CFCGAPC1.Mod.stVal" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="CtlModelKind" />
		</DOType>
		<DOType id="B1R4F791CB1.GAPC2.Mod" cdc="ENC">
			<DA name="origin" fc="ST" bType="Struct" type="B1R4F791CB1.GAPC2.Mod.origin" />
			<DA name="ctlNum" fc="ST" bType="INT8U" />
			<DA name="stVal" fc="ST" bType="Enum" type="B1R4F791Application.CFCGAPC1.Mod.stVal" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="B1R4F791CB1.GAPC2.Mod.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="CtlModelKind" />
		</DOType>
		<DOType id="B1R4F791Application.CFCGAPC1.Beh" cdc="ENS">
			<DA name="stVal" fc="ST" bType="Enum" type="B1R4F791Application.CFCGAPC1.Beh.stVal" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Application.CFCGAPC1.Health" cdc="ENS">
			<DA name="stVal" fc="ST" bType="Enum" type="B1R4F791Application.CFCGAPC1.Health.stVal" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791CB1_79AutoReclosing.CYC_RREC1.AutoRecSt" cdc="ENS">
			<DA name="stVal" fc="ST" bType="Enum" type="AutoRecSt" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Ln1.SE_RFLO1.FltLoop" cdc="ENS">
			<DA name="stVal" fc="ST" bType="Enum" type="FltLoop" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Application.LTIM0.TmOfsTmm" cdc="ING">
			<DA name="minVal" fc="CF" bType="INT32" />
			<DA name="maxVal" fc="CF" bType="INT32" />
			<DA name="stepSize" fc="CF" bType="INT32U" />
			<DA name="setVal" fc="SE" bType="INT32" />
		</DOType>
		<DOType id="B1R4F791CB1.XCBR1.OpCnt" cdc="INS">
			<DA name="stVal" fc="ST" bType="INT32" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791Application.CFCGAPC1.NamPlt" cdc="LPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="configRev" fc="DC" bType="VisString255" />
			<DA name="lnNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="B1R4F791CB1_25Synchronization.GENRSYN1.DifVClc" cdc="MV">
			<DA name="instMag" fc="MX" bType="Struct" type="B1R4F791CB1_25Synchronization.GENRSYN1.DifVClc.instMag" />
			<DA name="mag" fc="MX" bType="Struct" type="B1R4F791CB1_25Synchronization.GENRSYN1.DifVClc.instMag" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="B1R4F791CB1.XCBR1.SumSwARs.units" />
			<DA name="db" fc="CF" bType="INT32U" />
		</DOType>
		<DOType id="B1R4F791CB1.XCBR1.BlkOpn" cdc="SPC">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="CtlModelKind" />
		</DOType>
		<DOType id="B1R4F791Application.LTIM0.TmUseDT" cdc="SPG">
			<DA name="setVal" fc="SE" bType="BOOLEAN" />
		</DOType>
		<DOType id="B1R4F791Application.CFCGAPC1.SPS" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="subEna" fc="SV" bType="BOOLEAN" />
			<DA name="subVal" fc="SV" bType="BOOLEAN" />
			<DA name="subQ" fc="SV" bType="Quality" />
			<DA name="subID" fc="SV" bType="VisString64" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="B1R4F791Application.LTIM0.TmDT" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="B1R4F791CB1_79AutoReclosing.GEN_RREC1.NotRdy" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="dataNs" fc="EX" bType="VisString255" />
		</DOType>
		<DAType id="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.instCVal.mag">
			<BDA name="f" bType="FLOAT32" />
		</DAType>
		<DAType id="B1R4F791Application.LLN0.Mod.origin">
			<BDA name="orCat" bType="Enum" type="orCategory" />
			<BDA name="orIdent" bType="Octet64" />
		</DAType>
		<DAType id="B1R4F791Application.LLN0.Mod.Oper.origin">
			<BDA name="orCat" bType="Enum" type="orCategory" />
			<BDA name="orIdent" bType="Octet64" />
		</DAType>
		<DAType id="B1R4F791CB1.CSWI1.SPC.pulseConfig">
			<BDA name="cmdQual" bType="Enum" type="ControlOutputKind" />
			<BDA name="onDur" bType="INT32U" />
			<BDA name="offDur" bType="INT32U" />
			<BDA name="numPls" bType="INT32U" />
		</DAType>
		<DAType id="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.units">
			<BDA name="SIUnit" bType="Enum" type="SIUnit" />
			<BDA name="multiplier" bType="Enum" type="multiplier" />
		</DAType>
		<DAType id="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.instCVal">
			<BDA name="mag" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.instCVal.mag" />
			<BDA name="ang" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.instCVal.mag" />
		</DAType>
		<DAType id="B1R4F791Ln1_OperationalValues.PPRE_MMXU1.W.phsA.instCVal">
			<BDA name="mag" bType="Struct" type="B1R4F791CB1_Fundamental.FPRE_MMXU1.PPV.phsAB.instCVal.mag" />
		</DAType>
		<DAType id="B1R4F791Application.LLN0.LEDRs.Oper">
			<BDA name="ctlVal" bType="BOOLEAN" />
			<BDA name="origin" bType="Struct" type="B1R4F791Application.LLN0.Mod.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
			<BDA name="Check" bType="Check" />
		</DAType>
		<DAType id="B1R4F791CB1.CSWI1.Pos.Cancel">
			<BDA name="ctlVal" bType="BOOLEAN" />
			<BDA name="origin" bType="Struct" type="B1R4F791Application.LLN0.Mod.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
		</DAType>
		<DAType id="B1R4F791Application.LLN0.Mod.Oper">
			<BDA name="ctlVal" bType="Enum" type="Mod" />
			<BDA name="origin" bType="Struct" type="B1R4F791Application.LLN0.Mod.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
			<BDA name="Check" bType="Check" />
		</DAType>
		<DAType id="B1R4F791CB1_25Synchronization.GENRSYN1.DifVClc.instMag">
			<BDA name="f" bType="FLOAT32" />
		</DAType>
		<DAType id="B1R4F791CB1.GAPC2.Mod.origin">
			<BDA name="orCat" bType="Enum" type="OriginatorCategoryKind" />
			<BDA name="orIdent" bType="Octet64" />
		</DAType>
		<DAType id="B1R4F791CB1.GAPC2.Mod.Oper.origin">
			<BDA name="orCat" bType="Enum" type="OriginatorCategoryKind" />
			<BDA name="orIdent" bType="Octet64" />
		</DAType>
		<DAType id="B1R4F791CB1.XCBR4.Pos.pulseConfig">
			<BDA name="cmdQual" bType="Enum" type="B1R4F791CB1.XCBR4.Pos.pulseConfig.cmdQual" />
			<BDA name="onDur" bType="INT32U" />
			<BDA name="offDur" bType="INT32U" />
			<BDA name="numPls" bType="INT32U" />
		</DAType>
		<DAType id="B1R4F791CB1.XCBR1.SumSwARs.units">
			<BDA name="SIUnit" bType="Enum" type="SIUnitKind" />
			<BDA name="multiplier" bType="Enum" type="MultiplierKind" />
		</DAType>
		<DAType id="B1R4F791Ln1.SE_RFLO1.FltZ.instCVal">
			<BDA name="mag" bType="Struct" type="B1R4F791CB1_25Synchronization.GENRSYN1.DifVClc.instMag" />
			<BDA name="ang" bType="Struct" type="B1R4F791CB1_25Synchronization.GENRSYN1.DifVClc.instMag" />
		</DAType>
		<DAType id="B1R4F791CB1.GAPC2.Mod.Oper">
			<BDA name="ctlVal" bType="Enum" type="B1R4F791Application.CFCGAPC1.Mod.stVal" />
			<BDA name="origin" bType="Struct" type="B1R4F791CB1.GAPC2.Mod.Oper.origin" />
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
		<EnumType id="sboClass">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="0">operate-once</EnumVal>
			<EnumVal ord="1">operate-many</EnumVal>
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
		<EnumType id="dir">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="0">unknown</EnumVal>
			<EnumVal ord="1">forward</EnumVal>
			<EnumVal ord="2">backward</EnumVal>
			<EnumVal ord="3">both</EnumVal>
		</EnumType>
		<EnumType id="seqT">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="0">pos-neg-zero</EnumVal>
			<EnumVal ord="1">dir-quad-zero</EnumVal>
		</EnumType>
		<EnumType id="ControlOutputKind">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="0">pulse</EnumVal>
			<EnumVal ord="1">persistent</EnumVal>
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
		<EnumType id="B1R4F791CB1.XCBR4.Pos.pulseConfig.cmdQual">
			<!--Source: IEC 61850-7-3:2007A-->
			<EnumVal ord="0">pulse</EnumVal>
			<EnumVal ord="1">persistent</EnumVal>
		</EnumType>
		<EnumType id="CtlModelKind">
			<!--Source: IEC 61850-7-3:2007A-->
			<EnumVal ord="0">status-only</EnumVal>
			<EnumVal ord="1">direct-with-normal-security</EnumVal>
			<EnumVal ord="2">sbo-with-normal-security</EnumVal>
			<EnumVal ord="3">direct-with-enhanced-security</EnumVal>
			<EnumVal ord="4">sbo-with-enhanced-security</EnumVal>
		</EnumType>
		<EnumType id="OriginatorCategoryKind">
			<!--Source: IEC 61850-7-3:2007A-->
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
		<EnumType id="FaultDirectionKind">
			<!--Source: IEC 61850-7-3:2007A-->
			<EnumVal ord="0">unknown</EnumVal>
			<EnumVal ord="1">forward</EnumVal>
			<EnumVal ord="2">backward</EnumVal>
			<EnumVal ord="3">both</EnumVal>
		</EnumType>
		<EnumType id="PhaseFaultDirectionKind">
			<!--Source: IEC 61850-7-3:2007A-->
			<EnumVal ord="0">unknown</EnumVal>
			<EnumVal ord="1">forward</EnumVal>
			<EnumVal ord="2">backward</EnumVal>
		</EnumType>
		<EnumType id="MultiplierKind">
			<!--Source: IEC 61850-7-3:2007A-->
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
		<EnumType id="SIUnitKind">
			<!--Source: IEC 61850-7-3:2007A-->
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
			<EnumVal ord="22">Bq</EnumVal>
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
			<EnumVal ord="55">W/m²</EnumVal>
			<EnumVal ord="56">J/m²</EnumVal>
			<EnumVal ord="57">S/m</EnumVal>
			<EnumVal ord="58">K/s</EnumVal>
			<EnumVal ord="59">Pa/s</EnumVal>
			<EnumVal ord="60">J/kg K</EnumVal>
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
			<EnumVal ord="75">Hz/s</EnumVal>
			<EnumVal ord="76">char</EnumVal>
			<EnumVal ord="77">char/s</EnumVal>
			<EnumVal ord="78">kgm²</EnumVal>
			<EnumVal ord="79">dB</EnumVal>
			<EnumVal ord="80">J/Wh</EnumVal>
			<EnumVal ord="81">W/s</EnumVal>
			<EnumVal ord="82">l/s</EnumVal>
			<EnumVal ord="83">dBm</EnumVal>
		</EnumType>
		<EnumType id="AutoRecSt">
			<!--Source: IEC 61850-7-4:2007A-->
			<EnumVal ord="1">Ready</EnumVal>
			<EnumVal ord="2">In progress</EnumVal>
			<EnumVal ord="3">Successful</EnumVal>
			<EnumVal ord="4">Waiting for trip</EnumVal>
			<EnumVal ord="5">Trip issued by protection</EnumVal>
			<EnumVal ord="6">Fault disappeared</EnumVal>
			<EnumVal ord="7">Wait to complete</EnumVal>
			<EnumVal ord="8">Circuit breaker closed</EnumVal>
			<EnumVal ord="9">Cycle unsuccessful</EnumVal>
			<EnumVal ord="10">Unsuccessful</EnumVal>
			<EnumVal ord="11">Aborted</EnumVal>
		</EnumType>
		<EnumType id="B1R4F791Application.CFCGAPC1.Beh.stVal">
			<!--Source: IEC 61850-7-4:2007A-->
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">on-blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
		<EnumType id="FltLoop">
			<!--Source: IEC 61850-7-4:2007A-->
			<EnumVal ord="1">Phase A to Ground</EnumVal>
			<EnumVal ord="2">Phase B to Ground</EnumVal>
			<EnumVal ord="3">Phase C to Ground</EnumVal>
			<EnumVal ord="4">Phase A to B</EnumVal>
			<EnumVal ord="5">Phase B to C</EnumVal>
			<EnumVal ord="6">Phase C to A</EnumVal>
			<EnumVal ord="7">Other</EnumVal>
		</EnumType>
		<EnumType id="B1R4F791Application.CFCGAPC1.Health.stVal">
			<!--Source: IEC 61850-7-4:2007A-->
			<EnumVal ord="1">Ok</EnumVal>
			<EnumVal ord="2">Warning</EnumVal>
			<EnumVal ord="3">Alarm</EnumVal>
		</EnumType>
		<EnumType id="B1R4F791Application.CFCGAPC1.Mod.stVal">
			<!--Source: IEC 61850-7-4:2007A-->
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">on-blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
	</DataTypeTemplates>
</SCL>

<?xml version="1.0" encoding="UTF-8"?>
<!--Created by rhard with OMICRON IEDScout 4.20 licensed to -->
<!--SCL Schema Version 3.1 (2012/10/22)-->
<SCL version="2007" revision="B" xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.iec.ch/61850/2003/SCL SCL.xsd">
	<Header id="" version="" revision="" toolID="OMICRON IEDScout" nameStructure="IEDName" />
	<Communication>
		<SubNetwork name="NONE" type="8-MMS">
			<ConnectedAP iedName="AA1E1Q01KF2" apName="P1">
				<Address>
					<P type="IP" xsi:type="tP_IP">172.20.17.164</P>
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
	<IED name="AA1E1Q01KF2">
		<Services>
			<DynAssociation />
			<GetDirectory />
			<GetDataObjectDefinition />
			<DataObjectDirectory />
			<GetDataSetValue />
			<SetDataSetValue />
			<DataSetDirectory />
			<ConfDataSet max="8" modify="false" />
			<DynDataSet max="42" />
			<ReadWrite />
			<SettingGroups>
				<SGEdit />
				<ConfSG />
			</SettingGroups>
			<ConfReportControl max="40" bufConf="false" />
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
				<LDevice inst="CTRL">
					<LN0 lnType="AA1E1Q01KF2CTRL.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LocSta">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>ABB</Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>Control LLN0 Control</Val>
							</DAI>
							<DAI name="configRev">
								<Val>106339</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
						<DOI name="LocRemMod">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="StaAuth">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="AA1E1Q01KF2CTRL.LPHD1" lnClass="LPHD" inst="1">
						<DOI name="PhyNam">
							<DAI name="vendor">
								<Val>ABB</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="DR">
					<LN0 lnType="AA1E1Q01KF2DR.LLN0" lnClass="LLN0" inst="">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val>ABB</Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>DR LLN0 Name plate</Val>
							</DAI>
							<DAI name="configRev">
								<Val>2951029</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
						</DOI>
					</LN0>
					<LN lnType="AA1E1Q01KF2CTRL.LPHD1" lnClass="LPHD" inst="1">
						<DOI name="PhyNam">
							<DAI name="vendor">
								<Val>ABB</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>IL1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="10">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 10 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>Analog ch 10 input</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="11">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 11 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>Analog ch 11 input</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="12">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 12 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>Analog ch 12 input</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 2 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>IL2</Val>
							</DAI>
							<DAI name="setVal">
								<Val>3</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 3 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>IL3</Val>
							</DAI>
							<DAI name="setVal">
								<Val>4</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="4">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 4 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>Io</Val>
							</DAI>
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="5">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 5 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>U1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>10</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="6">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 6 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>U2</Val>
							</DAI>
							<DAI name="setVal">
								<Val>11</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="7">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 7 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>U3</Val>
							</DAI>
							<DAI name="setVal">
								<Val>12</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="8">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 8 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>Analog ch 8 input</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RADR1" lnClass="RADR" inst="9">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="HiTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LoTrgLev">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Analog ch 9 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EChNum">
							<DAI name="d">
								<Val>Analog ch 9 input</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 1 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="10">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 10 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 10 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="11">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 11 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 11 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="12">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 12 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 12 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="13">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 13 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 13 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="14">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 14 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 14 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="15">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 15 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 15 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="16">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 16 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 16 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="17">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 17 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 17 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="18">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 18 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 18 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="19">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 19 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 19 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 2 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 2 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="20">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 20 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 20 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="21">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 21 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 21 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="22">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 22 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 22 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="23">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 23 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 23 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="24">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 24 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 24 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="25">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 25 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 25 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Other</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="26">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 26 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 26 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="27">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 27 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 27 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="28">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 28 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 28 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="29">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 29 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 29 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 3 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 3 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="30">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 30 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 30 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="31">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 31 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 31 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="32">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 32 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 32 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="33">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 33 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 33 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="34">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 34 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 34 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="35">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 35 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 35 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="36">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 36 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 36 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="37">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 37 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 37 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="38">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 38 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 38 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="39">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 39 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 39 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="4">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 4 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 4 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="40">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 40 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 40 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="41">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 41 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 41 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="42">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 42 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 42 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="43">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 43 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 43 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="44">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 44 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 44 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="45">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 45 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 45 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="46">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 46 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 46 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="47">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 47 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 47 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="48">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 48 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 48 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="49">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 49 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 49 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="5">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 5 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 5 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="50">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 50 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 50 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="51">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 51 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 51 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="52">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 52 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 52 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="53">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 53 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 53 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="54">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 54 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 54 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="55">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 55 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 55 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="56">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 56 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 56 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="57">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 57 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 57 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="58">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 58 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 58 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="59">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 59 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 59 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="6">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 6 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 6 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="60">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 60 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 60 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="61">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 61 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 61 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="62">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 62 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 62 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="63">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 63 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 63 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="64">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 64 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 64 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="7">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 7 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 7 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="8">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 8 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 8 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR" inst="9">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Binary ch 9 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EInput">
							<DAI name="d">
								<Val>Binary ch 9 input</Val>
							</DAI>
						</DOI>
						<DOI name="LevMod">
							<DAI name="setVal">
								<Val>Positive or Rising</Val>
							</DAI>
						</DOI>
						<DOI name="EStoMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2DR.RDRE1" lnClass="RDRE" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Disturbance recorder Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="RcdTrg">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Disturbance recorder Trig recording</Val>
							</DAI>
						</DOI>
						<DOI name="MemClr">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Disturbance recorder Disturbance records</Val>
							</DAI>
						</DOI>
						<DOI name="PerTrgTms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>604800</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="ExclTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>1000000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="OpMod">
							<DAI name="setVal">
								<Val>Overwrite existing values</Val>
							</DAI>
						</DOI>
						<DOI name="EPreLgt">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>100</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>50</Val>
							</DAI>
						</DOI>
						<DOI name="ERcdLgt">
							<DAI name="minVal">
								<Val>10</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>500</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>50</Val>
							</DAI>
						</DOI>
						<DOI name="EStoRte">
							<DAI name="setVal">
								<Val>32</Val>
							</DAI>
						</DOI>
						<DOI name="EStoModPer">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="EStoModMan">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
				<LDevice inst="LD0">
					<LN0 lnType="AA1E1Q01KF2LD0.LLN0" lnClass="LLN0" inst="">
						<DataSet name="MeasFlt">
							<FCDA ldInst="LD0" prefix="VS" lnClass="MSQI" lnInst="1" doName="SeqV" fc="MX" />
							<FCDA ldInst="LD0" prefix="V" lnClass="MMXU" lnInst="1" doName="PhV" fc="MX" />
							<FCDA ldInst="LD0" prefix="PE" lnClass="MMXU" lnInst="1" doName="TotW" fc="MX" />
							<FCDA ldInst="LD0" prefix="PE" lnClass="MMXU" lnInst="1" doName="TotVAr" fc="MX" />
							<FCDA ldInst="LD0" prefix="PE" lnClass="MMXU" lnInst="1" doName="TotVA" fc="MX" />
							<FCDA ldInst="LD0" prefix="PE" lnClass="MMXU" lnInst="1" doName="TotPF" fc="MX" />
							<FCDA ldInst="LD0" prefix="CS" lnClass="MSQI" lnInst="1" doName="SeqA" fc="MX" />
							<FCDA ldInst="LD0" prefix="T2" lnClass="PTTR" lnInst="1" doName="Tmp" fc="MX" />
							<FCDA ldInst="LD0" prefix="T2" lnClass="PTTR" lnInst="1" doName="TmpRl" fc="MX" />
							<FCDA ldInst="LD0" prefix="XR" lnClass="GGIO" lnInst="130" doName="AnIn1" fc="MX" />
							<FCDA ldInst="LD0" prefix="XR" lnClass="GGIO" lnInst="130" doName="AnIn2" fc="MX" />
							<FCDA ldInst="LD0" prefix="XR" lnClass="GGIO" lnInst="130" doName="AnIn3" fc="MX" />
							<FCDA ldInst="LD0" prefix="XR" lnClass="GGIO" lnInst="130" doName="AnIn4" fc="MX" />
							<FCDA ldInst="LD0" prefix="XR" lnClass="GGIO" lnInst="130" doName="AnIn5" fc="MX" />
							<FCDA ldInst="LD0" prefix="XR" lnClass="GGIO" lnInst="130" doName="AnIn6" fc="MX" />
							<FCDA ldInst="LD0" prefix="XR" lnClass="GGIO" lnInst="130" doName="AnIn7" fc="MX" />
							<FCDA ldInst="LD0" prefix="XR" lnClass="GGIO" lnInst="130" doName="AnIn8" fc="MX" />
							<FCDA ldInst="LD0" prefix="C" lnClass="MMXU" lnInst="1" doName="A" fc="MX" />
							<FCDA ldInst="LD0" prefix="C" lnClass="MMXU" lnInst="1" doName="A" fc="MX" />
							<FCDA ldInst="LD0" prefix="C" lnClass="MMXU" lnInst="1" doName="A" fc="MX" />
							<FCDA ldInst="LD0" prefix="V" lnClass="MMXU" lnInst="1" doName="PPV" fc="MX" />
							<FCDA ldInst="LD0" prefix="V" lnClass="MMXU" lnInst="1" doName="PPV" fc="MX" />
							<FCDA ldInst="LD0" prefix="V" lnClass="MMXU" lnInst="1" doName="PPV" fc="MX" />
						</DataSet>
						<DataSet name="MeasReg">
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="OpCnt" fc="ST" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="ProFcn" fc="ST" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="StrDur" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="OpTm" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="ActSG" fc="ST" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="MaxAmpsA" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="MaxAmpsB" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="MaxAmpsC" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="MaxAmpsN" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="AmpsA" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="AmpsB" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="AmpsC" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="AmpsN" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="AmpsNClc" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="AmpsPsSeq" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="AmpsNgSeq" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="VoltsA" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="VoltsB" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="VoltsC" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="VoltsAB" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="VoltsBC" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="VoltsCA" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="VZroSeq" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="VPsSeq" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="VNgSeq" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="MaxTmpRl" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="DifAAngBC" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="DifBAngCA" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="DifCAngAB" fc="MX" />
							<FCDA ldInst="LD0" prefix="FLT" lnClass="MSTA" lnInst="1" doName="CBClrTm" fc="MX" />
						</DataSet>
						<DataSet name="StatDR">
							<FCDA ldInst="DR" prefix="" lnClass="RDRE" lnInst="1" doName="RcdMade" fc="ST" />
							<FCDA ldInst="DR" prefix="" lnClass="RDRE" lnInst="1" doName="RcdStr" fc="ST" />
							<FCDA ldInst="DR" prefix="" lnClass="RDRE" lnInst="1" doName="ERcdStored" fc="ST" />
							<FCDA ldInst="DR" prefix="" lnClass="RDRE" lnInst="1" doName="ERcdDelete" fc="ST" />
							<FCDA ldInst="DR" prefix="" lnClass="RDRE" lnInst="1" doName="EMemFull" fc="ST" />
							<FCDA ldInst="DR" prefix="" lnClass="RDRE" lnInst="1" doName="EOwRcd" fc="ST" />
							<FCDA ldInst="DR" prefix="" lnClass="RDRE" lnInst="1" doName="EPerTrg" fc="ST" />
							<FCDA ldInst="DR" prefix="" lnClass="RDRE" lnInst="1" doName="EManTrg" fc="ST" />
						</DataSet>
						<DataSet name="StatIO">
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="100" doName="SPCSO1" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="100" doName="SPCSO2" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="100" doName="SPCSO3" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="100" doName="SPCSO4" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="100" doName="SPCSO5" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="100" doName="SPCSO6" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO1" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO2" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO3" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO4" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO5" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO6" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO7" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO8" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO9" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO10" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="GGIO" lnInst="1" doName="ISCSO11" fc="ST" />
							<FCDA ldInst="LD0" prefix="TRP" lnClass="PTRC" lnInst="1" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="TapOpR" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="TapOpL" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="SPCSO1" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="SPCSO2" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="SPCSO3" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="SPCSO4" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="Ind1" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="Ind2" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="Ind3" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="Ind4" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="Ind5" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="Ind6" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="Ind7" fc="ST" />
							<FCDA ldInst="LD0" prefix="X" lnClass="GGIO" lnInst="110" doName="Ind8" fc="ST" />
						</DataSet>
						<DataSet name="StatIed">
							<FCDA ldInst="LD0" prefix="" lnClass="LLN0" doName="Beh" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LLN0" doName="NamPlt" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LLN0" doName="SetSeld" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LLN0" doName="SetChg" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LLN0" doName="ActSG" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LPHD" lnInst="1" doName="PhyHealth" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LPHD" lnInst="1" doName="PhyHealth1" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LPHD" lnInst="1" doName="PhyHealth2" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LPHD" lnInst="1" doName="OutOv" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LPHD" lnInst="1" doName="OutOv1" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LPHD" lnInst="1" doName="PwrUp" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LPHD" lnInst="1" doName="PwrDn" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LPHD" lnInst="1" doName="PwrDn1" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LPHD" lnInst="1" doName="ChgFlg" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="LPHD" lnInst="1" doName="FacSet" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="IHMI" lnInst="1" doName="LocClk" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="GSAL" lnInst="1" doName="AuthAcsA" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="GSAL" lnInst="1" doName="AuthAcsB" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="GSAL" lnInst="1" doName="AuthAcsC" fc="ST" />
							<FCDA ldInst="LD0" prefix="" lnClass="GSAL" lnInst="1" doName="AuthAcsD" fc="ST" />
							<FCDA ldInst="LD0" prefix="DIAG" lnClass="LCCH" lnInst="1" doName="ChLiv" fc="ST" />
							<FCDA ldInst="LD0" prefix="DIAG" lnClass="LCCH" lnInst="1" doName="RedChLiv" fc="ST" />
							<FCDA ldInst="LD0" prefix="GNRL" lnClass="LTMS" lnInst="1" doName="TmSrcSt" fc="ST" />
							<FCDA ldInst="LD0" prefix="GNRL" lnClass="LTMS" lnInst="1" doName="TmSyn" fc="ST" />
							<FCDA ldInst="LD0" prefix="GNRL" lnClass="LTMS" lnInst="1" doName="TmChSt1" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="PTRC" lnInst="1" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="LED" lnClass="PTRC" lnInst="1" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="TCS" lnClass="SCBR" lnInst="1" doName="CirAlm" fc="ST" />
							<FCDA ldInst="LD0" prefix="TCS" lnClass="SCBR" lnInst="2" doName="CirAlm" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="CtlDlOn" fc="ST" />
							<FCDA ldInst="LD0" prefix="SEQ" lnClass="RFUF" lnInst="1" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="SEQ" lnClass="RFUF" lnInst="1" doName="Str3Ph" fc="ST" />
							<FCDA ldInst="LD0" prefix="CC" lnClass="RDIF" lnInst="1" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="CC" lnClass="RDIF" lnInst="1" doName="Alm" fc="ST" />
							<FCDA ldInst="LD0" prefix="IL1" lnClass="TCTR" lnInst="1" doName="Alm" fc="ST" />
							<FCDA ldInst="LD0" prefix="IL1" lnClass="TCTR" lnInst="1" doName="Wrn" fc="ST" />
							<FCDA ldInst="LD0" prefix="RES" lnClass="TCTR" lnInst="1" doName="Alm" fc="ST" />
							<FCDA ldInst="LD0" prefix="RES" lnClass="TCTR" lnInst="1" doName="Wrn" fc="ST" />
							<FCDA ldInst="LD0" prefix="UL1" lnClass="TVTR" lnInst="1" doName="Alm" fc="ST" />
							<FCDA ldInst="LD0" prefix="UL1" lnClass="TVTR" lnInst="1" doName="Wrn" fc="ST" />
						</DataSet>
						<DataSet name="StatNrmlA">
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTUV" lnInst="1" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTUV" lnInst="1" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTUV" lnInst="2" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTUV" lnInst="2" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTUV" lnInst="3" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTUV" lnInst="3" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTOV" lnInst="1" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTOV" lnInst="1" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTOV" lnInst="2" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTOV" lnInst="2" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTOV" lnInst="3" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="PH" lnClass="PTOV" lnInst="3" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="TRP" lnClass="PTRC" lnInst="1" doName="Tr" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="ParOp" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="Auto" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="CtlOpModSt" fc="ST" />
							<FCDA ldInst="LD0" prefix="PHI" lnClass="PTOC" lnInst="1" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="PHI" lnClass="PTOC" lnInst="1" doName="Op" fc="ST" />
						</DataSet>
						<DataSet name="StatNrmlB">
							<FCDA ldInst="LD0" prefix="PHH" lnClass="PTOC" lnInst="1" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="PHH" lnClass="PTOC" lnInst="1" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="PHL" lnClass="PTOC" lnInst="1" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="PHL" lnClass="PTOC" lnInst="1" doName="Op" fc="ST" />
							<FCDA ldInst="LD0" prefix="T2" lnClass="PTTR" lnInst="1" doName="Str" fc="ST" />
							<FCDA ldInst="LD0" prefix="T2" lnClass="PTTR" lnInst="1" doName="Op" fc="ST" />
						</DataSet>
						<DataSet name="StatUrg">
							<FCDA ldInst="LD0" prefix="GSE" lnClass="GGIO" lnInst="1" doName="Alm" fc="ST" />
							<FCDA ldInst="LD0" prefix="LDP" lnClass="MSTA" lnInst="1" doName="MemWrn" fc="ST" />
							<FCDA ldInst="LD0" prefix="LDP" lnClass="MSTA" lnInst="1" doName="MemAlm" fc="ST" />
							<FCDA ldInst="LD0" prefix="V" lnClass="MMXU" lnInst="1" doName="HiAlm" fc="ST" />
							<FCDA ldInst="LD0" prefix="V" lnClass="MMXU" lnInst="1" doName="HiWrn" fc="ST" />
							<FCDA ldInst="LD0" prefix="V" lnClass="MMXU" lnInst="1" doName="LoWrn" fc="ST" />
							<FCDA ldInst="LD0" prefix="V" lnClass="MMXU" lnInst="1" doName="LoAlm" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="EndPosR" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="EndPosL" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="TapOpErr" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="LTCBlkAHi" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="LTCBlkVLo" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="LTCRnbk" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="LTCBlkCirA" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="LTCBlkSt" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="ErrParTra" fc="ST" />
							<FCDA ldInst="LD0" prefix="TPOS" lnClass="SLTC" lnInst="1" doName="TapPos" fc="ST" />
							<FCDA ldInst="LD0" prefix="C" lnClass="MMXU" lnInst="1" doName="HiAlm" fc="ST" />
							<FCDA ldInst="LD0" prefix="C" lnClass="MMXU" lnInst="1" doName="HiWrn" fc="ST" />
							<FCDA ldInst="LD0" prefix="C" lnClass="MMXU" lnInst="1" doName="LoWrn" fc="ST" />
							<FCDA ldInst="LD0" prefix="C" lnClass="MMXU" lnInst="1" doName="LoAlm" fc="ST" />
							<FCDA ldInst="LD0" prefix="T2" lnClass="PTTR" lnInst="1" doName="AlmThm" fc="ST" />
							<FCDA ldInst="LD0" prefix="XR" lnClass="GGIO" lnInst="130" doName="Alm" fc="ST" />
							<FCDA ldInst="LD0" prefix="XR" lnClass="GGIO" lnInst="130" doName="Wrn" fc="ST" />
							<FCDA ldInst="CTRL" prefix="" lnClass="LLN0" doName="Loc" fc="ST" />
							<FCDA ldInst="CTRL" prefix="" lnClass="LLN0" doName="LocRem" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="YLTC" lnInst="1" doName="TapChg" fc="ST" />
							<FCDA ldInst="LD0" prefix="OL" lnClass="ATCC" lnInst="1" doName="TapChg" fc="ST" />
						</DataSet>
						<ReportControl name="rcbStatIed" buffered="true" bufTime="100" datSet="StatIed" intgPd="3000" confRev="1">
							<TrgOps dchg="true" qchg="true" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<ReportControl name="rcbStatNrmlA" buffered="true" bufTime="100" datSet="StatNrmlA" intgPd="3000" confRev="1">
							<TrgOps dchg="true" qchg="true" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<ReportControl name="rcbStatNrmlB" buffered="true" bufTime="100" datSet="StatNrmlB" intgPd="3000" confRev="1">
							<TrgOps dchg="true" qchg="true" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<ReportControl name="rcbStatIO" buffered="true" bufTime="100" datSet="StatIO" intgPd="3000" confRev="1">
							<TrgOps dchg="true" qchg="true" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<ReportControl name="rcbStatUrg" buffered="true" bufTime="100" datSet="StatUrg" intgPd="3000" confRev="200">
							<TrgOps dchg="true" qchg="true" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<ReportControl name="rcbMeasFlt" buffered="true" bufTime="100" datSet="MeasFlt" intgPd="3000" confRev="200">
							<TrgOps dchg="true" qchg="true" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<ReportControl name="rcbMeasReg" buffered="true" bufTime="0" datSet="MeasReg" intgPd="3000" confRev="1">
							<TrgOps dchg="true" qchg="true" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<ReportControl name="rcbStatDR" buffered="true" bufTime="100" datSet="StatDR" intgPd="3000" confRev="1">
							<TrgOps dchg="true" qchg="true" dupd="false" period="false" gi="true" />
							<OptFields seqNum="false" timeStamp="false" dataSet="false" reasonCode="false" dataRef="false" entryID="false" configRef="false" />
							<RptEnabled max="5" />
						</ReportControl>
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>G</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Name plate</Val>
							</DAI>
							<DAI name="configRev">
								<Val>2109194</Val>
							</DAI>
							<DAI name="ldNs">
								<Val>IEC 61850-7-4:2003</Val>
							</DAI>
							<DAI name="eIp">
								<Val>2.85.200.25</Val>
							</DAI>
							<DAI name="eIpSubNet">
								<Val>255.255.0.0</Val>
							</DAI>
							<DAI name="eIpGateWay">
								<Val>192.168.2.1</Val>
							</DAI>
							<DAI name="eIpFront">
								<Val>192.168.0.254</Val>
							</DAI>
							<DAI name="eIpSNTPpri">
								<Val>2.85.200.240</Val>
							</DAI>
							<DAI name="eIpSNTPsec">
								<Val>2.85.200.240</Val>
							</DAI>
							<DAI name="eLang">
								<Val></Val>
							</DAI>
							<DAI name="eFD">
								<Val>ABB</Val>
							</DAI>
						</DOI>
						<DOI name="LEDRs1">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Indications and LEDs</Val>
							</DAI>
						</DOI>
						<DOI name="LEDRs2">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Programmable LEDs</Val>
							</DAI>
						</DOI>
						<DOI name="MtrRecRs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Reset minimum and maximum demands</Val>
							</DAI>
						</DOI>
						<DOI name="PQRs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Reset all power quality data</Val>
							</DAI>
						</DOI>
						<DOI name="SetSeld">
							<DAI name="d">
								<Val>Protection LLN0 Settings reservation</Val>
							</DAI>
						</DOI>
						<DOI name="SetChg">
							<DAI name="d">
								<Val>Protection LLN0 Settings change</Val>
							</DAI>
						</DOI>
						<DOI name="BlkMode">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="HzSetE">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="PhRotSet">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="DiVThres">
							<DAI name="minVal">
								<Val>16</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>176</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>2</Val>
							</DAI>
							<DAI name="setVal">
								<Val>16</Val>
							</DAI>
						</DOI>
						<DOI name="DiOscThres">
							<DAI name="minVal">
								<Val>2</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>50</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>30</Val>
							</DAI>
						</DOI>
						<DOI name="DiOscHyst">
							<DAI name="minVal">
								<Val>2</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>50</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>10</Val>
							</DAI>
						</DOI>
						<DOI name="CpySG">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="ActSG">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>1</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>6</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Active setting group</Val>
							</DAI>
						</DOI>
						<DOI name="Act1SG">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Active setting group 1</Val>
							</DAI>
						</DOI>
						<DOI name="Act2SG">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Active setting group 2</Val>
							</DAI>
						</DOI>
						<DOI name="Act3SG">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Active setting group 3</Val>
							</DAI>
						</DOI>
						<DOI name="Act4SG">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Active setting group 4</Val>
							</DAI>
						</DOI>
						<DOI name="Act5SG">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Active setting group 5</Val>
							</DAI>
						</DOI>
						<DOI name="Act6SG">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Active setting group 6</Val>
							</DAI>
						</DOI>
						<DOI name="LgcSelSG">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Protection LLN0 Logic selection for setting group</Val>
							</DAI>
						</DOI>
						<DOI name="OpModSG">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="PhOrdMod">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="ACrvSatPnt">
							<SDI name="minVal">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>50.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>50.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="SvMaxDl">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>s</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>m</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Protection LLN0 Max Delay</Val>
							</DAI>
						</DOI>
						<DOI name="SvAvDl">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>s</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>m</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>Protection LLN0 Average delay</Val>
							</DAI>
						</DOI>
						<DOI name="ADmdAvMod">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="MtrDmdItrv">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="HzAdEna">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="SetSvMaxDl">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<SettingControl numOfSGs="6" actSG="1" />
					</LN0>
					<LN lnType="AA1E1Q01KF2LD0.CCRDIF1" prefix="CC" lnClass="RDIF" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>CCRDIF1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>CCRDIF1 Detection ofcurrent circuit failure</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>CCRDIF1 Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="StrVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>0.2</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="MaxOpA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>5.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.5</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="DifAClc">
							<SDI name="res">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val></Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>CCRDIF1 IDIFF</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.CMMXU1" prefix="C" lnClass="MMXU" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>D</Val>
							</DAI>
							<DAI name="d">
								<Val>CMMXU1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="A">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val></Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2500</Val>
								</DAI>
								<DAI name="zeroDb">
									<Val>25</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>1.4</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>1.2</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>40.0</Val>
										</DAI>
									</SDI>
								</SDI>
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
								<DAI name="db">
									<Val>2500</Val>
								</DAI>
								<DAI name="zeroDb">
									<Val>25</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>1.4</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>1.2</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>40.0</Val>
										</DAI>
									</SDI>
								</SDI>
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
								<DAI name="db">
									<Val>2500</Val>
								</DAI>
								<DAI name="zeroDb">
									<Val>25</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>1.4</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>1.2</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>40.0</Val>
										</DAI>
									</SDI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>CMMXU1 Phase currents</Val>
							</DAI>
						</DOI>
						<DOI name="HiAlm">
							<DAI name="d">
								<Val>CMMXU1 High alarm</Val>
							</DAI>
						</DOI>
						<DOI name="HiWrn">
							<DAI name="d">
								<Val>CMMXU1 High warning</Val>
							</DAI>
						</DOI>
						<DOI name="LoWrn">
							<DAI name="d">
								<Val>CMMXU1 Low warning</Val>
							</DAI>
						</DOI>
						<DOI name="LoAlm">
							<DAI name="d">
								<Val>CMMXU1 Low alarm</Val>
							</DAI>
						</DOI>
						<DOI name="AMeasMod">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.CMSTA1" prefix="C" lnClass="MSTA" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>D</Val>
							</DAI>
							<DAI name="d">
								<Val>CMMXU1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="AvAmpsA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>CMMXU1 I_DMD_A</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>CMMXU1 Maximum demand for Phase A</Val>
							</DAI>
						</DOI>
						<DOI name="MinAmpsA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>CMMXU1 Minimum demand for Phase A</Val>
							</DAI>
						</DOI>
						<DOI name="AvAmpsB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>CMMXU1 I_DMD_B</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>CMMXU1 Maximum demand for Phase B</Val>
							</DAI>
						</DOI>
						<DOI name="MinAmpsB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>CMMXU1 Minimum demand for Phase B</Val>
							</DAI>
						</DOI>
						<DOI name="AvAmpsC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>CMMXU1 I_DMD_C</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>CMMXU1 Maximum demand for Phase C</Val>
							</DAI>
						</DOI>
						<DOI name="MinAmpsC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>CMMXU1 Minimum demand for Phase C</Val>
							</DAI>
						</DOI>
						<DOI name="RecRs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>CMMXU1 CMMXU1 demands</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.CSMSQI1" prefix="CS" lnClass="MSQI" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>B</Val>
							</DAI>
							<DAI name="d">
								<Val>CSMSQI1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="SeqA">
							<SDI name="c1">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val></Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2500</Val>
								</DAI>
								<DAI name="zeroDb">
									<Val>25</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>1.4</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>1.2</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>40.0</Val>
										</DAI>
									</SDI>
								</SDI>
							</SDI>
							<SDI name="c2">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val></Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2500</Val>
								</DAI>
								<DAI name="zeroDb">
									<Val>25</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>0.2</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>0.05</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>40.0</Val>
										</DAI>
									</SDI>
								</SDI>
							</SDI>
							<SDI name="c3">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val></Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
								<DAI name="db">
									<Val>2500</Val>
								</DAI>
								<DAI name="zeroDb">
									<Val>25</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>0.2</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>0.05</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>40.0</Val>
										</DAI>
									</SDI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>CSMSQI1 Positive, Negative and Zero Sequence Current</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.DIAGLCCH1" prefix="DIAG" lnClass="LCCH" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>A</Val>
							</DAI>
							<DAI name="d">
								<Val>Ethernet supervision DIAGLCCH1</Val>
							</DAI>
						</DOI>
						<DOI name="ChLiv">
							<DAI name="d">
								<Val>Ethernet supervision Channel live</Val>
							</DAI>
						</DOI>
						<DOI name="RedChLiv">
							<DAI name="d">
								<Val>Ethernet supervision Redundant channel live</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.FLTMSTA1" prefix="FLT" lnClass="MSTA" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>G</Val>
							</DAI>
							<DAI name="d">
								<Val>FLTMSTA1 Name plate</Val>
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
								<Val>FLTMSTA1 Frequency</Val>
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
						<DOI name="FltDiskm">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Distance to fault measured in pu</Val>
							</DAI>
						</DOI>
						<DOI name="InOp">
							<DAI name="d">
								<Val>FLTMSTA1 Operate input for triggering</Val>
							</DAI>
						</DOI>
						<DOI name="InStr">
							<DAI name="d">
								<Val>FLTMSTA1 Start input for triggering</Val>
							</DAI>
						</DOI>
						<DOI name="RecRs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>FLTMSTA1 Reset fault records</Val>
							</DAI>
						</DOI>
						<DOI name="SelRow">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>1</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>128</Val>
							</DAI>
							<DAI name="d">
								<Val>FLTMSTA1 Select recording</Val>
							</DAI>
						</DOI>
						<DOI name="StrDur">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum start duration of all stages during the fault</Val>
							</DAI>
						</DOI>
						<DOI name="OpTm">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>s</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Operate time</Val>
							</DAI>
						</DOI>
						<DOI name="ActSG">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>FLTMSTA1 Active setting group</Val>
							</DAI>
						</DOI>
						<DOI name="ShotPntr">
							<DAI name="d">
								<Val>FLTMSTA1 Shot pointer</Val>
							</DAI>
						</DOI>
						<DOI name="MxDifAClcA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum differential current phase A</Val>
							</DAI>
						</DOI>
						<DOI name="MxDifAClcB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum differential current phase B</Val>
							</DAI>
						</DOI>
						<DOI name="MxDifAClcC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum differential current phase C</Val>
							</DAI>
						</DOI>
						<DOI name="MxRstAClcA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum bias current phase A</Val>
							</DAI>
						</DOI>
						<DOI name="MxRstAClcB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum bias current phase B</Val>
							</DAI>
						</DOI>
						<DOI name="MxRstAClcC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum bias current phase C</Val>
							</DAI>
						</DOI>
						<DOI name="DifAmpsA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Differential current phase A</Val>
							</DAI>
						</DOI>
						<DOI name="DifAmpsB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Differential current phase B</Val>
							</DAI>
						</DOI>
						<DOI name="DifAmpsC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Differential current phase C</Val>
							</DAI>
						</DOI>
						<DOI name="RstAmpsA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Bias current phase A</Val>
							</DAI>
						</DOI>
						<DOI name="RstAmpsB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Bias current phase B</Val>
							</DAI>
						</DOI>
						<DOI name="RstAmpsC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Bias current phase C</Val>
							</DAI>
						</DOI>
						<DOI name="DifAmpsN">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Differential current residual</Val>
							</DAI>
						</DOI>
						<DOI name="RstAmpsN">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Bias current residual</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum phase A current</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum phase B current</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum phase C current</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsN">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum residual current</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase A current</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase B current</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase C current</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsN">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Residual current</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsNClc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Calculated residual current</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsPsSeq">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Positive sequence current</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsNgSeq">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Negative sequence current</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsAb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum phase A current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsBb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum phase B current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsCb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum phase C current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsNb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum residual current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsAb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase A current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsBb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase B current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsCb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase C current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsNb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Residual current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsNClcb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Calculated residual current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsPsSeqb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Positive sequence current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsNgSeqb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Negative sequence current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsAc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum phase A current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsBc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum phase B current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsCc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum phase C current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="MaxAmpsNc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Maximum residual current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsAc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase A current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsBc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase B current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsCc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase C current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsNc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Residual current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsNClcc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Calculated residual current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsPsSeqc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Positive sequence current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="AmpsNgSeqc">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Negative sequence current (c)</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase A voltage</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase B voltage</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase C voltage</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsAB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase A to phase B voltage</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsBC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase B to phase C voltage</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsCA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase C to phase A voltage</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsN">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Residual voltage</Val>
							</DAI>
						</DOI>
						<DOI name="VZroSeq">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Zero sequence voltage</Val>
							</DAI>
						</DOI>
						<DOI name="VPsSeq">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Positive sequence voltage</Val>
							</DAI>
						</DOI>
						<DOI name="VNgSeq">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Negative sequence voltage</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsAb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase A voltage (b)</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsBb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase B voltage (b)</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsCb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase C voltage (b)</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsABb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase A to phase B voltage (b)</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsBCb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase B to phase C voltage (b)</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsCAb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Phase C to phase A voltage (b)</Val>
							</DAI>
						</DOI>
						<DOI name="VoltsNb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Residual voltage (b)</Val>
							</DAI>
						</DOI>
						<DOI name="VZroSeqb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Zero sequence voltage (b)</Val>
							</DAI>
						</DOI>
						<DOI name="VPsSeqb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Positive sequence voltage (b)</Val>
							</DAI>
						</DOI>
						<DOI name="VNgSeqb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Negative sequence voltage (b)</Val>
							</DAI>
						</DOI>
						<DOI name="MaxTmpRl">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 PTTR thermal level</Val>
							</DAI>
						</DOI>
						<DOI name="PDNS1MxRat">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 PDNSPTOC1 rat. I2/I1</Val>
							</DAI>
						</DOI>
						<DOI name="DifNAngN">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Angle residual voltage - residual current</Val>
							</DAI>
						</DOI>
						<DOI name="DifAAngBC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Angle phase B to phase C voltage - phase A current</Val>
							</DAI>
						</DOI>
						<DOI name="DifBAngCA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Angle phase C to phase A voltage - phase B current</Val>
							</DAI>
						</DOI>
						<DOI name="DifCAngAB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Angle phase A to phase B voltage - phase C current</Val>
							</DAI>
						</DOI>
						<DOI name="DifNAngNb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Angle residual voltage - residual current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="DifAAngBCb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Angle phase B to phase C voltage - phase A current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="DifBAngCAb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Angle phase C to phase A voltage - phase B current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="DifCAngABb">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Angle phase A to phase B voltage - phase C current (b)</Val>
							</DAI>
						</DOI>
						<DOI name="HzS">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Frequency gradient</Val>
							</DAI>
						</DOI>
						<DOI name="CondN">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>S</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>m</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Conductance Yo</Val>
							</DAI>
						</DOI>
						<DOI name="SusN">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>S</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>m</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Susceptance Yo</Val>
							</DAI>
						</DOI>
						<DOI name="PPLoopRis">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>ohm</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Fault loop resistance</Val>
							</DAI>
						</DOI>
						<DOI name="PPLoopReac">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>ohm</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Fault loop reactance</Val>
							</DAI>
						</DOI>
						<DOI name="InCBClr">
							<DAI name="d">
								<Val>FLTMSTA1 Breaker open status</Val>
							</DAI>
						</DOI>
						<DOI name="CBClrTm">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>s</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>FLTMSTA1 Breaker clear time</Val>
							</DAI>
						</DOI>
						<DOI name="TrgSet">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="AMeasMod">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.GNRLLTMS1" prefix="GNRL" lnClass="LTMS" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="TmSrcSel1">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="DomId">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>255</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="PTPPrio1">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>255</Val>
							</DAI>
							<DAI name="setVal">
								<Val>128</Val>
							</DAI>
						</DOI>
						<DOI name="PTPPrio2">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>255</Val>
							</DAI>
							<DAI name="setVal">
								<Val>128</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>B</Val>
							</DAI>
							<DAI name="d">
								<Val>GNRLLTMS1 Name plate</Val>
							</DAI>
							<DAI name="mstrId">
								<Val>-------------------</Val>
							</DAI>
						</DOI>
						<DOI name="TmChSt1">
							<DAI name="d">
								<Val>GNRLLTMS1 Time channel status (up/down)</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>GNRLLTMS1 Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="Wrn">
							<DAI name="d">
								<Val>GNRLLTMS1 Warning</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.GSAL1" lnClass="GSAL" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>G</Val>
							</DAI>
							<DAI name="d">
								<Val>Security application Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="OpCntRs">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Security application Resetable Security Violations counter</Val>
							</DAI>
						</DOI>
						<DOI name="NumCntRs">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>Security application Number of counter resets</Val>
							</DAI>
						</DOI>
						<DOI name="AuthLoc">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
							<DAI name="pwdAdmin">
								<Val></Val>
							</DAI>
							<DAI name="pwdEng">
								<Val></Val>
							</DAI>
							<DAI name="pwdOper">
								<Val></Val>
							</DAI>
							<DAI name="pwdView">
								<Val></Val>
							</DAI>
						</DOI>
						<DOI name="AuthRem">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
							<DAI name="pwdAdmin">
								<Val></Val>
							</DAI>
							<DAI name="pwdEng">
								<Val></Val>
							</DAI>
							<DAI name="pwdOper">
								<Val></Val>
							</DAI>
							<DAI name="pwdView">
								<Val></Val>
							</DAI>
						</DOI>
						<DOI name="AuthAcsLev">
							<DAI name="setVal">
								<Val>4</Val>
							</DAI>
						</DOI>
						<DOI name="SecCommEna">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="RemUpdEna">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="AuthAcsA">
							<DAI name="d">
								<Val>VIEWER</Val>
							</DAI>
							<DAI name="eIsView">
								<Val>1</Val>
							</DAI>
							<DAI name="eIsOper">
								<Val>0</Val>
							</DAI>
							<DAI name="eIsEng">
								<Val>0</Val>
							</DAI>
							<DAI name="eIsAdmn">
								<Val>0</Val>
							</DAI>
							<DAI name="eCanViewOper">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanViewSet">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanForce">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanChgSet">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanChgConf">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanFirmChg">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanPasswdMgmt">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanAuditRead">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="AuthAcsB">
							<DAI name="d">
								<Val>OPERATOR</Val>
							</DAI>
							<DAI name="eIsView">
								<Val>0</Val>
							</DAI>
							<DAI name="eIsOper">
								<Val>1</Val>
							</DAI>
							<DAI name="eIsEng">
								<Val>0</Val>
							</DAI>
							<DAI name="eIsAdmn">
								<Val>0</Val>
							</DAI>
							<DAI name="eCanViewOper">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanViewSet">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanForce">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanChgSet">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanChgConf">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanFirmChg">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanPasswdMgmt">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanAuditRead">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="AuthAcsC">
							<DAI name="d">
								<Val>ENGINEER</Val>
							</DAI>
							<DAI name="eIsView">
								<Val>0</Val>
							</DAI>
							<DAI name="eIsOper">
								<Val>0</Val>
							</DAI>
							<DAI name="eIsEng">
								<Val>1</Val>
							</DAI>
							<DAI name="eIsAdmn">
								<Val>0</Val>
							</DAI>
							<DAI name="eCanViewOper">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanViewSet">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanForce">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanChgSet">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanChgConf">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanFirmChg">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanPasswdMgmt">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanAuditRead">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="AuthAcsD">
							<DAI name="d">
								<Val>ADMINISTRATOR</Val>
							</DAI>
							<DAI name="eIsView">
								<Val>0</Val>
							</DAI>
							<DAI name="eIsOper">
								<Val>0</Val>
							</DAI>
							<DAI name="eIsEng">
								<Val>0</Val>
							</DAI>
							<DAI name="eIsAdmn">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanViewOper">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanViewSet">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanForce">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanChgSet">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanChgConf">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanFirmChg">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanPasswdMgmt">
								<Val>1</Val>
							</DAI>
							<DAI name="eCanAuditRead">
								<Val>1</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.GSEGGIO1" prefix="GSE" lnClass="GGIO" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>GSEGGIO1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn1">
							<DAI name="d">
								<Val>GSEGGIO1 Received msgs</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn2">
							<DAI name="d">
								<Val>GSEGGIO1 Transmitted Messages</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn3">
							<DAI name="d">
								<Val>GSEGGIO1 Received State Changes</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn4">
							<DAI name="d">
								<Val>GSEGGIO1 Received Sequence Number</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn5">
							<DAI name="d">
								<Val>GSEGGIO1 Received frames with Test bit</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn6">
							<DAI name="d">
								<Val>GSEGGIO1 State warnings</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn7">
							<DAI name="d">
								<Val>GSEGGIO1 Sequence warnings</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn8">
							<DAI name="d">
								<Val>GSEGGIO1 Receiver Timeouts</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn9">
							<DAI name="d">
								<Val>GSEGGIO1 Received ConfRev mismatches</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn10">
							<DAI name="d">
								<Val>GSEGGIO1 Received frames with NeedsCommissioning bit</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn11">
							<DAI name="d">
								<Val>GSEGGIO1 Errors in received dataset</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>GSEGGIO1 Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="RstCnt">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>GSEGGIO1 Goose counters reset</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.IHMI1" lnClass="IHMI" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>G</Val>
							</DAI>
							<DAI name="d">
								<Val>Device Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EEName">
							<DAI name="vendor">
								<Val>ABB</Val>
							</DAI>
							<DAI name="hwRev">
								<Val>M</Val>
							</DAI>
							<DAI name="swRev">
								<Val>06.00.02.19</Val>
							</DAI>
							<DAI name="serNum">
								<Val>1YM192630897</Val>
							</DAI>
							<DAI name="model">
								<Val></Val>
							</DAI>
							<DAI name="location">
								<Val></Val>
							</DAI>
							<DAI name="eArtNum">
								<Val>2RCA025340A0001</Val>
							</DAI>
							<DAI name="eManDate">
								<Val>2016-10-25</Val>
							</DAI>
							<DAI name="eTestStatId">
								<Val>0</Val>
							</DAI>
							<DAI name="eTesterId">
								<Val></Val>
							</DAI>
							<DAI name="eTestDate">
								<Val>2016-10-25</Val>
							</DAI>
							<DAI name="eHwId">
								<Val>DISB02A</Val>
							</DAI>
						</DOI>
						<DOI name="LocClk">
							<DAI name="time">
								<Val>16:33:22</Val>
							</DAI>
							<DAI name="date">
								<Val>2026.05.20 </Val>
							</DAI>
							<DAI name="timeSpring">
								<Val>02:00</Val>
							</DAI>
							<DAI name="dateSpring">
								<Val>01.05.</Val>
							</DAI>
							<DAI name="offsetSpring">
								<Val>60</Val>
							</DAI>
							<DAI name="daySpring">
								<Val>0</Val>
							</DAI>
							<DAI name="timeAutumn">
								<Val>02:00</Val>
							</DAI>
							<DAI name="dateAutumn">
								<Val>25.09.</Val>
							</DAI>
							<DAI name="dayAutumn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="Lang">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="LangFile">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="Contr">
							<DAI name="minVal">
								<Val>1</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>255</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>60</Val>
							</DAI>
						</DOI>
						<DOI name="NumForm">
							<DAI name="minVal">
								<Val>1</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>2</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="BackLight">
							<DAI name="minVal">
								<Val>1</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>3</Val>
							</DAI>
						</DOI>
						<DOI name="EFrmT">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="EFrmD">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="NamCnv">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="DefView">
							<DAI name="setVal">
								<Val>3</Val>
							</DAI>
						</DOI>
						<DOI name="WhmiMod">
							<DAI name="setVal">
								<Val>3</Val>
							</DAI>
						</DOI>
						<DOI name="WhmiTout">
							<DAI name="minVal">
								<Val>1</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>3</Val>
							</DAI>
						</DOI>
						<DOI name="DisTest">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Device Display test</Val>
							</DAI>
						</DOI>
						<DOI name="EvClr">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Device Event clear</Val>
							</DAI>
						</DOI>
						<DOI name="ESldSymFor">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="ScrDlTms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>30</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="CBClsDlMod">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="CBClsDlTms">
							<DAI name="minVal">
								<Val>5</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>900</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>60</Val>
							</DAI>
						</DOI>
						<DOI name="SetVsb">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.IL1TCTR1" prefix="IL1" lnClass="TCTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Amp">
							<SDI name="sVC">
								<DAI name="scaleFactor">
									<Val>1.0</Val>
								</DAI>
								<DAI name="offset">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ARtg">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>6000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Cor">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.9</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.1</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="AngCor">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>-20.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ARtgSec">
							<DAI name="setVal">
								<Val>3</Val>
							</DAI>
						</DOI>
						<DOI name="ARtgNom">
							<SDI name="minVal">
								<DAI name="f">
									<Val>39.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>4000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1300.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VRtgSec">
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>50.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.001</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>3.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="RevPol">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>E</Val>
							</DAI>
							<DAI name="d">
								<Val>Current (3I,CT) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>Current (3I,CT) Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="Wrn">
							<DAI name="d">
								<Val>Current (3I,CT) Warning</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.IL1TCTR1" prefix="IL2" lnClass="TCTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Amp">
							<SDI name="sVC">
								<DAI name="scaleFactor">
									<Val>1.0</Val>
								</DAI>
								<DAI name="offset">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ARtg">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>6000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Cor">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.9</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.1</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="AngCor">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>-20.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ARtgSec">
							<DAI name="setVal">
								<Val>3</Val>
							</DAI>
						</DOI>
						<DOI name="ARtgNom">
							<SDI name="minVal">
								<DAI name="f">
									<Val>39.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>4000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1300.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VRtgSec">
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>50.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.001</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>3.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="RevPol">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>E</Val>
							</DAI>
							<DAI name="d">
								<Val>Current (3I,CT) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>Current (3I,CT) Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="Wrn">
							<DAI name="d">
								<Val>Current (3I,CT) Warning</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.IL1TCTR1" prefix="IL3" lnClass="TCTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Amp">
							<SDI name="sVC">
								<DAI name="scaleFactor">
									<Val>1.0</Val>
								</DAI>
								<DAI name="offset">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ARtg">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>6000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Cor">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.9</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.1</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="AngCor">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>-20.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ARtgSec">
							<DAI name="setVal">
								<Val>3</Val>
							</DAI>
						</DOI>
						<DOI name="ARtgNom">
							<SDI name="minVal">
								<DAI name="f">
									<Val>39.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>4000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1300.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VRtgSec">
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>50.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.001</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>3.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="RevPol">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>E</Val>
							</DAI>
							<DAI name="d">
								<Val>Current (3I,CT) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>Current (3I,CT) Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="Wrn">
							<DAI name="d">
								<Val>Current (3I,CT) Warning</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.LDPMSTA1" prefix="LDP" lnClass="MSTA" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C1</Val>
							</DAI>
							<DAI name="d">
								<Val>LDPMSTA1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="RecRs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>LDPMSTA1 Reset load profile rec.</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel1">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel2">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel3">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel4">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel5">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel6">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel7">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel8">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel9">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel10">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel11">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="QtySel12">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="MemWrnLev">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>100</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="MemAlmLev">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>100</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.LEDGGIO1" prefix="LED" lnClass="GGIO" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>E</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO1">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 1</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO2">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 2</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO3">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 3</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO4">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 4</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO5">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 5</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO6">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 6</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO7">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 7</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO8">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 8</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO9">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 9</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO10">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 10</Val>
							</DAI>
						</DOI>
						<DOI name="ISCSO11">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>3</Val>
							</DAI>
							<DAI name="d">
								<Val>Programmable LEDs LED 11</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq1">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq2">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq3">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq4">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq5">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq6">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq7">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq8">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq9">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq10">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="LEDSeq11">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="AlmColr">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.LEDPTRC1" prefix="LED" lnClass="PTRC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>F</Val>
							</DAI>
							<DAI name="d">
								<Val>Global conditioning Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>Global conditioning Operate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>Global conditioning Start</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.LPHD1" lnClass="LPHD" inst="1">
						<DOI name="PhyNam">
							<DAI name="vendor">
								<Val>ABB</Val>
							</DAI>
							<DAI name="hwRev">
								<Val>G</Val>
							</DAI>
							<DAI name="swRev">
								<Val>5.0.8</Val>
							</DAI>
							<DAI name="serNum">
								<Val>1VHR91309429</Val>
							</DAI>
							<DAI name="model">
								<Val>REU615</Val>
							</DAI>
							<DAI name="location">
								<Val></Val>
							</DAI>
							<DAI name="tmOffset">
								<Val>0</Val>
							</DAI>
							<DAI name="tmUseDT">
								<Val>0</Val>
							</DAI>
							<DAI name="eSwDate">
								<Val>2016-02-16 04:36 PM</Val>
							</DAI>
							<DAI name="eSwNum">
								<Val>2RCA032550H</Val>
							</DAI>
							<DAI name="eProdDate">
								<Val>2016-11-28</Val>
							</DAI>
							<DAI name="eOrdNum">
								<Val>HBUBCCAHNAA1BNN1XG</Val>
							</DAI>
							<DAI name="eCatNum">
								<Val>REx615X+</Val>
							</DAI>
							<DAI name="eConfName">
								<Val>UE02</Val>
							</DAI>
							<DAI name="eIedName">
								<Val>AA1E1Q01KF2</Val>
							</DAI>
							<DAI name="eBayName">
								<Val>TRAFO 60MVA - REU615</Val>
							</DAI>
							<DAI name="eMacAddr">
								<Val>00-21-C1-29-5A-7E</Val>
							</DAI>
							<DAI name="eMacAddr1">
								<Val>00-21-C1-29-5A-7D</Val>
							</DAI>
							<DAI name="eCustomer">
								<Val></Val>
							</DAI>
							<DAI name="eStreet">
								<Val></Val>
							</DAI>
							<DAI name="eHouseNum">
								<Val></Val>
							</DAI>
							<DAI name="eZip">
								<Val></Val>
							</DAI>
							<DAI name="eCity">
								<Val></Val>
							</DAI>
							<DAI name="eState">
								<Val></Val>
							</DAI>
							<DAI name="eCountry">
								<Val></Val>
							</DAI>
						</DOI>
						<DOI name="PhyHealth1">
							<DAI name="d">
								<Val>Physical device Warning</Val>
							</DAI>
						</DOI>
						<DOI name="PhyHealth2">
							<DAI name="debug">
								<Val></Val>
							</DAI>
							<DAI name="eDiag1">
								<Val>989</Val>
							</DAI>
							<DAI name="eDiag2">
								<Val>989</Val>
							</DAI>
							<DAI name="eDiag3">
								<Val>741</Val>
							</DAI>
							<DAI name="eDiag4">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="OutOv">
							<DAI name="d">
								<Val>Physical device Status overflow</Val>
							</DAI>
						</DOI>
						<DOI name="OutOv1">
							<DAI name="d">
								<Val>Physical device Meas overflow</Val>
							</DAI>
						</DOI>
						<DOI name="Proxy">
							<DAI name="d">
								<Val>Physical device Proxy</Val>
							</DAI>
						</DOI>
						<DOI name="PwrUp">
							<DAI name="d">
								<Val>Physical device Power up detected</Val>
							</DAI>
						</DOI>
						<DOI name="PwrDn">
							<DAI name="d">
								<Val>Physical device Warm start detected</Val>
							</DAI>
						</DOI>
						<DOI name="PwrDn1">
							<DAI name="d">
								<Val>Physical device Watchdog reset detected</Val>
							</DAI>
						</DOI>
						<DOI name="EEName">
							<DAI name="vendor">
								<Val>ABB</Val>
							</DAI>
							<DAI name="hwRev">
								<Val>D</Val>
							</DAI>
							<DAI name="swRev">
								<Val>-</Val>
							</DAI>
							<DAI name="serNum">
								<Val>1YM192607165</Val>
							</DAI>
							<DAI name="model">
								<Val></Val>
							</DAI>
							<DAI name="location">
								<Val></Val>
							</DAI>
							<DAI name="eArtNum">
								<Val>2RCA031146A0001</Val>
							</DAI>
							<DAI name="eManDate">
								<Val>2016-10-10</Val>
							</DAI>
							<DAI name="eTestStatId">
								<Val></Val>
							</DAI>
							<DAI name="eTesterId">
								<Val></Val>
							</DAI>
							<DAI name="eTestDate">
								<Val>2016-10-10</Val>
							</DAI>
							<DAI name="eHwId">
								<Val>CPU0007</Val>
							</DAI>
						</DOI>
						<DOI name="ChgFlg">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>15</Val>
							</DAI>
							<DAI name="d">
								<Val>Physical device Composition has changed</Val>
							</DAI>
						</DOI>
						<DOI name="RsDev">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Physical device Reset device</Val>
							</DAI>
						</DOI>
						<DOI name="IrfTst">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Physical device Internal fault test</Val>
							</DAI>
						</DOI>
						<DOI name="FacSet">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>Physical device Factory Setting</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.MMSGGIO1" prefix="MMS" lnClass="GGIO" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>D</Val>
							</DAI>
							<DAI name="d">
								<Val>61850-8-1 MMS Name plate</Val>
							</DAI>
							<DAI name="eIp1">
								<Val>2.85.200.13</Val>
							</DAI>
							<DAI name="eIp2">
								<Val>2.85.200.202</Val>
							</DAI>
							<DAI name="eIp3">
								<Val>2.85.200.254</Val>
							</DAI>
							<DAI name="eIp4">
								<Val></Val>
							</DAI>
							<DAI name="eIp5">
								<Val></Val>
							</DAI>
						</DOI>
						<DOI name="IntIn1">
							<DAI name="d">
								<Val>61850-8-1 MMS Successful Connections</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn2">
							<DAI name="d">
								<Val>61850-8-1 MMS Failed Connections</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn3">
							<DAI name="d">
								<Val>61850-8-1 MMS Concludes</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn4">
							<DAI name="d">
								<Val>61850-8-1 MMS Sent Aborts</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn5">
							<DAI name="d">
								<Val>61850-8-1 MMS Received Aborts</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn6">
							<DAI name="d">
								<Val>61850-8-1 MMS Sent Rejects</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn7">
							<DAI name="d">
								<Val>61850-8-1 MMS Received Request</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn8">
							<DAI name="d">
								<Val>61850-8-1 MMS Failed Requests</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn9">
							<DAI name="d">
								<Val>61850-8-1 MMS Successful Reads</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn10">
							<DAI name="d">
								<Val>61850-8-1 MMS Failed Reads</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn11">
							<DAI name="d">
								<Val>61850-8-1 MMS Successful Writes</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn12">
							<DAI name="d">
								<Val>61850-8-1 MMS Failed Writes</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn13">
							<DAI name="d">
								<Val>61850-8-1 MMS Information Reports</Val>
							</DAI>
						</DOI>
						<DOI name="IntIn14">
							<DAI name="d">
								<Val>61850-8-1 MMS Active Connections</Val>
							</DAI>
						</DOI>
						<DOI name="SGConfMod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="Status">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>61850-8-1 MMS Communication status</Val>
							</DAI>
						</DOI>
						<DOI name="UnitMod">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="StdCnf1">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="StdCnf2">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.OLATCC1" prefix="OL" lnClass="ATCC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Loc">
							<DAI name="d">
								<Val>OLATCC1 Local operation</Val>
							</DAI>
						</DOI>
						<DOI name="OpCntRs">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1 Resetable operation counter</Val>
							</DAI>
						</DOI>
						<DOI name="TapChg">
							<DAI name="persistent">
								<Val>0</Val>
							</DAI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>-36</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>36</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1 Change Tap Position (stop, lower, higher)</Val>
							</DAI>
						</DOI>
						<DOI name="ParOp">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1 Parallel/Independent operation</Val>
							</DAI>
						</DOI>
						<DOI name="LTCBlk">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1 Block (Inhibit) control output of LTC </Val>
							</DAI>
						</DOI>
						<DOI name="VRed1">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1 Voltage reduction step 1</Val>
							</DAI>
						</DOI>
						<DOI name="CtlV">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>OLATCC1 Control voltage</Val>
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
								<Val>OLATCC1 Load current (total transformer secondary current)</Val>
							</DAI>
						</DOI>
						<DOI name="CircA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>OLATCC1 Circulating current</Val>
							</DAI>
						</DOI>
						<DOI name="Auto">
							<DAI name="d">
								<Val>OLATCC1 Automatic/Manual operation</Val>
							</DAI>
						</DOI>
						<DOI name="EndPosR">
							<DAI name="d">
								<Val>OLATCC1 Block raise</Val>
							</DAI>
						</DOI>
						<DOI name="EndPosL">
							<DAI name="d">
								<Val>OLATCC1 Block lower </Val>
							</DAI>
						</DOI>
						<DOI name="TapOpErr">
							<DAI name="d">
								<Val>OLATCC1 Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="TapOpR">
							<DAI name="d">
								<Val>OLATCC1 Raise command for own transformer</Val>
							</DAI>
						</DOI>
						<DOI name="TapOpL">
							<DAI name="d">
								<Val>OLATCC1 Lower command for own transformer</Val>
							</DAI>
						</DOI>
						<DOI name="BndCtr">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.001</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="BndWid">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.2</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>18.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.5</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="CtlDlTmms1">
							<DAI name="minVal">
								<Val>1000</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>300000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>100</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="CtlDlTmms2">
							<DAI name="minVal">
								<Val>1000</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>300000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>100</Val>
							</DAI>
							<DAI name="setVal" />
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
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>25.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
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
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>25.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="RnbkRV">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.8</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.4</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.1</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LimLodA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>5.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.2</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VRedVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>9.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TmDlChr">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="TapBlkR">
							<DAI name="minVal">
								<Val>-36</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>36</Val>
							</DAI>
							<DAI name="setVal">
								<Val>17</Val>
							</DAI>
						</DOI>
						<DOI name="TapBlkL">
							<DAI name="minVal">
								<Val>-36</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>36</Val>
							</DAI>
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="BlkVLo">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.2</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.9</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ParTraMod">
							<DAI name="setVal" />
						</DOI>
						<DOI name="LodPhAng">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>-89.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>89.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="StabFact">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>70.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="VCtlOpMod">
							<DAI name="setVal">
								<Val>4</Val>
							</DAI>
						</DOI>
						<DOI name="LTCPlsTmms">
							<DAI name="minVal">
								<Val>500</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>10000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>100</Val>
							</DAI>
							<DAI name="setVal">
								<Val>5000</Val>
							</DAI>
						</DOI>
						<DOI name="ManBlkTyp">
							<DAI name="setVal">
								<Val>4</Val>
							</DAI>
						</DOI>
						<DOI name="LimCircA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>5.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.5</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LimLDC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LDCEna">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="RPFAllw">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="OpTmhMax">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>10000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>100</Val>
							</DAI>
						</DOI>
						<DOI name="CmdErrTms">
							<DAI name="minVal">
								<Val>10</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>50</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="FllwDlTms">
							<DAI name="minVal">
								<Val>6</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>20</Val>
							</DAI>
							<DAI name="setVal">
								<Val>6</Val>
							</DAI>
						</DOI>
						<DOI name="RsCnt">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1 Counter reset</Val>
							</DAI>
						</DOI>
						<DOI name="ALod">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VMeas">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>OLATCC1 Voltage, average filtered</Val>
							</DAI>
						</DOI>
						<DOI name="AngVAPhA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>OLATCC1 Angle U_A-I_A</Val>
							</DAI>
						</DOI>
						<DOI name="CtlVDif">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>OLATCC1 Voltage difference</Val>
							</DAI>
						</DOI>
						<DOI name="ClcLDC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>OLATCC1 Calculated Line Drop Compensation</Val>
							</DAI>
						</DOI>
						<DOI name="Tra1A">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Tra2A">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Tra3A">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="LTCBlkAHi">
							<DAI name="d">
								<Val>OLATCC1 Block load current</Val>
							</DAI>
						</DOI>
						<DOI name="LTCBlkVLo">
							<DAI name="d">
								<Val>OLATCC1 Block under voltage</Val>
							</DAI>
						</DOI>
						<DOI name="LTCRnbk">
							<DAI name="d">
								<Val>OLATCC1 Block runback raise voltage</Val>
							</DAI>
						</DOI>
						<DOI name="LTCBlkCirA">
							<DAI name="d">
								<Val>OLATCC1 Block circulating current</Val>
							</DAI>
						</DOI>
						<DOI name="LTCBlkSt">
							<DAI name="d">
								<Val>OLATCC1 External block status</Val>
							</DAI>
						</DOI>
						<DOI name="ErrParTra">
							<DAI name="d">
								<Val>OLATCC1 Parallel failure</Val>
							</DAI>
						</DOI>
						<DOI name="InConSta">
							<DAI name="d">
								<Val>OLATCC1 Connection status</Val>
							</DAI>
						</DOI>
						<DOI name="InLTCOp">
							<DAI name="d">
								<Val>OLATCC1 Tap Changer Operating</Val>
							</DAI>
						</DOI>
						<DOI name="AlmEna">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="ParTraNum">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="VolSpt">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.001</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="TapChgR">
							<DAI name="d">
								<Val>OLATCC1 RAISE_LOCAL</Val>
							</DAI>
						</DOI>
						<DOI name="TapChgL">
							<DAI name="d">
								<Val>OLATCC1 LOWER_LOCAL</Val>
							</DAI>
						</DOI>
						<DOI name="CtlDlSt">
							<DAI name="d">
								<Val>OLATCC1 Timer on</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.OLYLTC1" prefix="OL" lnClass="YLTC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>OLYLTC1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="TapChg">
							<DAI name="persistent">
								<Val>0</Val>
							</DAI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="minVal">
								<Val>-36</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>36</Val>
							</DAI>
							<DAI name="d">
								<Val>OLYLTC1 TAPCHG_LOCAL</Val>
							</DAI>
						</DOI>
						<DOI name="EndPosR">
							<DAI name="d">
								<Val>OLYLTC1 Block raise</Val>
							</DAI>
						</DOI>
						<DOI name="EndPosL">
							<DAI name="d">
								<Val>OLYLTC1 Block lower</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PEMMTR1" prefix="PE" lnClass="MMTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>PEMMXU1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="SupWh">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>Wh</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>1.0</Val>
							</DAI>
							<DAI name="d">
								<Val>PEMMXU1 EA_RV_ACM</Val>
							</DAI>
						</DOI>
						<DOI name="SupVArh">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VArh</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>1.0</Val>
							</DAI>
							<DAI name="d">
								<Val>PEMMXU1 ER_RV_ACM</Val>
							</DAI>
						</DOI>
						<DOI name="DmdWh">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>Wh</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>1.0</Val>
							</DAI>
							<DAI name="d">
								<Val>PEMMXU1 EA_FWD_ACM</Val>
							</DAI>
						</DOI>
						<DOI name="DmdVArh">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VArh</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="pulsQty">
								<Val>1.0</Val>
							</DAI>
							<DAI name="d">
								<Val>PEMMXU1 ER_FWD_ACM</Val>
							</DAI>
						</DOI>
						<DOI name="IniDmdWh">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>999999999</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="IniSupWh">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>999999999</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="IniDmdVArh">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>999999999</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="IniSupVArh">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>999999999</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="SupDmdRs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>PEMMXU1 Reset of accumulated energy readings</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PEMMXU1" prefix="PE" lnClass="MMXU" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>PEMMXU1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="TotW">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>W</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Total Active Power (Total P)</Val>
							</DAI>
						</DOI>
						<DOI name="TotVAr">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VAr</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Total Reactive Power (Total Q)</Val>
							</DAI>
						</DOI>
						<DOI name="TotVA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VA</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Total Apparent Power (Total S)</Val>
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
								<Val>PEMMXU1 Average Power factor (Total PF)</Val>
							</DAI>
						</DOI>
						<DOI name="WhDir">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="VArhDir">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PEMSTA1" prefix="PE" lnClass="MSTA" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>PEMMXU1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="AvVA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VA</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Average apparent power</Val>
							</DAI>
						</DOI>
						<DOI name="MaxVA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VA</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Maximum apparent power</Val>
							</DAI>
						</DOI>
						<DOI name="MinVA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VA</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Minimum apparent power</Val>
							</DAI>
						</DOI>
						<DOI name="AvW">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>W</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Average active power</Val>
							</DAI>
						</DOI>
						<DOI name="MaxW">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>W</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Maximum active power</Val>
							</DAI>
						</DOI>
						<DOI name="MinW">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>W</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Minimum active power</Val>
							</DAI>
						</DOI>
						<DOI name="AvVAr">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VAr</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Average reactive power</Val>
							</DAI>
						</DOI>
						<DOI name="MaxVAr">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VAr</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Maximum reactive power</Val>
							</DAI>
						</DOI>
						<DOI name="MinVAr">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>VAr</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Minimum reactive power</Val>
							</DAI>
						</DOI>
						<DOI name="AvPF">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PEMMXU1 Average power factor</Val>
							</DAI>
						</DOI>
						<DOI name="RecRs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>PEMMXU1 PEMMXU1 demands</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PHHPTOC1" prefix="PHH" lnClass="PTOC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="TmACrv">
							<DAI name="setParA">
								<Val>28.2</Val>
							</DAI>
							<DAI name="setParB">
								<Val>0.122</Val>
							</DAI>
							<DAI name="setParC">
								<Val>2.0</Val>
							</DAI>
							<DAI name="setParD">
								<Val>29.1</Val>
							</DAI>
							<DAI name="setParE">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setCharact" />
						</DOI>
						<DOI name="StrVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>40.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TmMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>15.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="MinOpTmms">
							<DAI name="minVal">
								<Val>20</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>40</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>200000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="TypRsCrv">
							<DAI name="setVal" />
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="AMeasMod">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="StrValMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.8</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>E</Val>
							</DAI>
							<DAI name="d">
								<Val>PHHPTOC1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>PHHPTOC1 Start</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>PHHPTOC1 Operate</Val>
							</DAI>
						</DOI>
						<DOI name="InEnaMult">
							<DAI name="d">
								<Val>PHHPTOC1 Enable signal for current multiplier </Val>
							</DAI>
						</DOI>
						<DOI name="StrDur">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PHHPTOC1 Ratio of start time / operate time</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PHIPTOC1" prefix="PHI" lnClass="PTOC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="StrVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>40.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>20</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>200000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="StrValMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.8</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>D</Val>
							</DAI>
							<DAI name="d">
								<Val>PHIPTOC1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>PHIPTOC1 Start</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>PHIPTOC1 Operate</Val>
							</DAI>
						</DOI>
						<DOI name="InEnaMult">
							<DAI name="d">
								<Val>PHIPTOC1 Enable signal for current multiplier </Val>
							</DAI>
						</DOI>
						<DOI name="StrDur">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PHIPTOC1 Ratio of start time / operate time</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PHHPTOC1" prefix="PHL" lnClass="PTOC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="TmACrv">
							<DAI name="setParA">
								<Val>28.2</Val>
							</DAI>
							<DAI name="setParB">
								<Val>0.122</Val>
							</DAI>
							<DAI name="setParC">
								<Val>2.0</Val>
							</DAI>
							<DAI name="setParD">
								<Val>29.1</Val>
							</DAI>
							<DAI name="setParE">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setCharact" />
						</DOI>
						<DOI name="StrVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>5.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TmMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>15.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="MinOpTmms">
							<DAI name="minVal">
								<Val>20</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>40</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>200000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="TypRsCrv">
							<DAI name="setVal" />
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="AMeasMod">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="StrValMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.8</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>D</Val>
							</DAI>
							<DAI name="d">
								<Val>PHLPTOC1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>PHLPTOC1 Start</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>PHLPTOC1 Operate</Val>
							</DAI>
						</DOI>
						<DOI name="InEnaMult">
							<DAI name="d">
								<Val>PHLPTOC1 Enable signal for current multiplier </Val>
							</DAI>
						</DOI>
						<DOI name="StrDur">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PHLPTOC1 Ratio of start time / operate time</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PHPTOV1" prefix="PH" lnClass="PTOV" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="TmVCrv">
							<DAI name="setParA">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParB">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParC">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParD">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParE">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setCharact" />
						</DOI>
						<DOI name="StrVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.6</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TmMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>15.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="MinOpTmms">
							<DAI name="minVal">
								<Val>40</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>40</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>40</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>300000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="TypRsCrv">
							<DAI name="setVal" />
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>PHPTOV1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>PHPTOV1 Start</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>PHPTOV1 Operate</Val>
							</DAI>
						</DOI>
						<DOI name="StrDur">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PHPTOV1 Ratio of start time / operate time</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="CrvSatRl">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VSel">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="HysRl">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>5.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>4.0</Val>
								</DAI>
							</SDI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PHPTOV1" prefix="PH" lnClass="PTOV" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="TmVCrv">
							<DAI name="setParA">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParB">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParC">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParD">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParE">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setCharact" />
						</DOI>
						<DOI name="StrVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.6</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TmMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>15.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="MinOpTmms">
							<DAI name="minVal">
								<Val>40</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>40</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>40</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>300000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="TypRsCrv">
							<DAI name="setVal" />
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>PHPTOV2 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>PHPTOV2 Start</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>PHPTOV2 Operate</Val>
							</DAI>
						</DOI>
						<DOI name="StrDur">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PHPTOV2 Ratio of start time / operate time</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="CrvSatRl">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VSel">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="HysRl">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>5.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>4.0</Val>
								</DAI>
							</SDI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PHPTOV1" prefix="PH" lnClass="PTOV" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="TmVCrv">
							<DAI name="setParA">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParB">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParC">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParD">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParE">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setCharact" />
						</DOI>
						<DOI name="StrVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.6</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TmMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>15.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="MinOpTmms">
							<DAI name="minVal">
								<Val>40</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>40</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>40</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>300000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="TypRsCrv">
							<DAI name="setVal" />
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>PHPTOV3 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>PHPTOV3 Start</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>PHPTOV3 Operate</Val>
							</DAI>
						</DOI>
						<DOI name="StrDur">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PHPTOV3 Ratio of start time / operate time</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="CrvSatRl">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VSel">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="HysRl">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>5.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>4.0</Val>
								</DAI>
							</SDI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PHPTUV1" prefix="PH" lnClass="PTUV" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="TmVCrv">
							<DAI name="setParA">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParB">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParC">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParD">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParE">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setCharact" />
						</DOI>
						<DOI name="StrVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.2</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TmMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>15.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="MinOpTmms">
							<DAI name="minVal">
								<Val>60</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>60</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>60</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>300000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="TypRsCrv">
							<DAI name="setVal" />
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="BlkVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.2</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>PHPTUV1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>PHPTUV1 Start</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>PHPTUV1 Operate</Val>
							</DAI>
						</DOI>
						<DOI name="StrDur">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PHPTUV1 Ratio of start time / operate time</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="CrvSatRl">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VSel">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="EnaBlkVal">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="HysRl">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>5.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>4.0</Val>
								</DAI>
							</SDI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PHPTUV1" prefix="PH" lnClass="PTUV" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="TmVCrv">
							<DAI name="setParA">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParB">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParC">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParD">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParE">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setCharact" />
						</DOI>
						<DOI name="StrVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.2</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TmMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>15.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="MinOpTmms">
							<DAI name="minVal">
								<Val>60</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>60</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>60</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>300000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="TypRsCrv">
							<DAI name="setVal" />
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="BlkVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.2</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>PHPTUV2 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>PHPTUV2 Start</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>PHPTUV2 Operate</Val>
							</DAI>
						</DOI>
						<DOI name="StrDur">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PHPTUV2 Ratio of start time / operate time</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="CrvSatRl">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VSel">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="EnaBlkVal">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="HysRl">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>5.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>4.0</Val>
								</DAI>
							</SDI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.PHPTUV1" prefix="PH" lnClass="PTUV" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="TmVCrv">
							<DAI name="setParA">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParB">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setParC">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParD">
								<Val>0.0</Val>
							</DAI>
							<DAI name="setParE">
								<Val>1.0</Val>
							</DAI>
							<DAI name="setCharact" />
						</DOI>
						<DOI name="StrVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.2</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TmMult">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>15.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="MinOpTmms">
							<DAI name="minVal">
								<Val>60</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>60</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>60</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>300000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>10</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="TypRsCrv">
							<DAI name="setVal" />
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>20</Val>
							</DAI>
						</DOI>
						<DOI name="BlkVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.2</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>PHPTUV3 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>PHPTUV3 Start</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>PHPTUV3 Operate</Val>
							</DAI>
						</DOI>
						<DOI name="StrDur">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>PHPTUV3 Ratio of start time / operate time</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="CrvSatRl">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>10.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VSel">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="EnaBlkVal">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="HysRl">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>5.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>4.0</Val>
								</DAI>
							</SDI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.RESTCTR1" prefix="RES" lnClass="TCTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="Amp">
							<SDI name="sVC">
								<DAI name="scaleFactor">
									<Val>1.0</Val>
								</DAI>
								<DAI name="offset">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ARtg">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>A</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>6000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Cor">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.9</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.1</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="AngCor">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>-20.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ARtgSec">
							<DAI name="setVal">
								<Val>3</Val>
							</DAI>
						</DOI>
						<DOI name="RevPol">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>Current (Io,CT) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>Current (Io,CT) Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="Wrn">
							<DAI name="d">
								<Val>Current (Io,CT) Warning</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.SEQRFUF1" prefix="SEQ" lnClass="RFUF" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>SEQRFUF1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>SEQRFUF1 General start of function </Val>
							</DAI>
						</DOI>
						<DOI name="Str3Ph">
							<DAI name="d">
								<Val>SEQRFUF1 Three-phase start of function</Val>
							</DAI>
						</DOI>
						<DOI name="InPosCls">
							<DAI name="d">
								<Val>SEQRFUF1 Active when circuit breaker is closed</Val>
							</DAI>
						</DOI>
						<DOI name="InDCPosOpn">
							<DAI name="d">
								<Val>SEQRFUF1 Active when line disconnector is open</Val>
							</DAI>
						</DOI>
						<DOI name="InMCBPsOpn">
							<DAI name="d">
								<Val>SEQRFUF1 Active when external MCB opens protected voltage circui</Val>
							</DAI>
						</DOI>
						<DOI name="BlkValA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NgSeqLevA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.03</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>0.2</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.03</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ChgRteA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>0.5</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.15</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="ChgRteEna">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="ChgRteV">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.5</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>0.9</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.6</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="EnaSealIn">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="BlkValV">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.7</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="SealInV">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.7</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="NgSeqLevV">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.03</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>0.2</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="DeaLinValA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.SPCGGIO1" prefix="SPC" lnClass="GGIO" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO1">
							<SDI name="pulseConfig">
								<DAI name="cmdQual">
									<Val>pulse</Val>
								</DAI>
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1.RAISE_LOCAL</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO2">
							<SDI name="pulseConfig">
								<DAI name="cmdQual">
									<Val>pulse</Val>
								</DAI>
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1.LOWER_LOCAL</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO3">
							<SDI name="pulseConfig">
								<DAI name="cmdQual">
									<Val>pulse</Val>
								</DAI>
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1.AUTO</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO4">
							<SDI name="pulseConfig">
								<DAI name="cmdQual">
									<Val>pulse</Val>
								</DAI>
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>OLATCC1.MANUAL</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO5">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 5</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO6">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 6</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO7">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 7</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO8">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 8</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO9">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 9</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO10">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 10</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO11">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 11</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO12">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 12</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO13">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 13</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO14">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 14</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO15">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 15</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO16">
							<SDI name="pulseConfig">
								<DAI name="onDur">
									<Val>1000</Val>
								</DAI>
								<DAI name="offDur">
									<Val>0</Val>
								</DAI>
								<DAI name="numPls">
									<Val>1</Val>
								</DAI>
							</SDI>
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>SPCGGIO1 Output 16</Val>
							</DAI>
						</DOI>
						<DOI name="LocRemRst">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.T2PTTR1" prefix="T2" lnClass="PTTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>T2PTTR1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Tmp">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>T2PTTR1 TEMP</Val>
							</DAI>
						</DOI>
						<DOI name="TmpRl">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>T2PTTR1 TEMP_RL</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>T2PTTR1 Start</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>T2PTTR1 Operate</Val>
							</DAI>
						</DOI>
						<DOI name="AlmThm">
							<DAI name="d">
								<Val>T2PTTR1 Thermal Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="TmpMax">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>200.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="ConsTms1">
							<DAI name="minVal">
								<Val>6</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="ConsTms2">
							<DAI name="minVal">
								<Val>60</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal" />
						</DOI>
						<DOI name="AlmVal">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>40.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>100.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="RsTmp">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>T2PTTR1 Reset temperature</Val>
							</DAI>
						</DOI>
						<DOI name="InhRec">
							<DAI name="d">
								<Val>T2PTTR1 Block reclose signal</Val>
							</DAI>
						</DOI>
						<DOI name="TmpUsed">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>T2PTTR1 The ambient temperature used in the calculation</Val>
							</DAI>
						</DOI>
						<DOI name="ARef">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.05</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>4.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="EnvTmpSet">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>-50.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>100.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="IniTmp">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>100.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>80.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="RecTmpSet">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>40.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>100.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TmpR">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>200.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="WghFact">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.01</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
						<DOI name="OpTmp">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>80.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>120.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f" />
							</SDI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.TCSSCBR1" prefix="TCS" lnClass="SCBR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>B</Val>
							</DAI>
							<DAI name="d">
								<Val>TCSSCBR1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="CirAlm">
							<DAI name="d">
								<Val>TCSSCBR1 Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>20</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>300000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>3000</Val>
							</DAI>
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>20</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>1000</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.TCSSCBR1" prefix="TCS" lnClass="SCBR" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>B</Val>
							</DAI>
							<DAI name="d">
								<Val>TCSSCBR2 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="CirAlm">
							<DAI name="d">
								<Val>TCSSCBR2 Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms">
							<DAI name="minVal">
								<Val>20</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>300000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>3000</Val>
							</DAI>
						</DOI>
						<DOI name="RsDlTmms">
							<DAI name="minVal">
								<Val>20</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>1000</Val>
							</DAI>
						</DOI>
						<DOI name="TstOutCmd">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.TPGAPC1" prefix="TP" lnClass="GAPC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="PlsTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>150</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>B</Val>
							</DAI>
							<DAI name="d">
								<Val>TPGAPC1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>TPGAPC1 OUT1</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>TPGAPC1 IN2/OUT2</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.TPGAPC1" prefix="TP" lnClass="GAPC" inst="2">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="PlsTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>150</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>B</Val>
							</DAI>
							<DAI name="d">
								<Val>TPGAPC2 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>TPGAPC2 IN1/OUT1</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>TPGAPC2 IN2/OUT2</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.TPGAPC1" prefix="TP" lnClass="GAPC" inst="3">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="PlsTmms">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>150</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>B</Val>
							</DAI>
							<DAI name="d">
								<Val>TPGAPC3 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Str">
							<DAI name="d">
								<Val>TPGAPC3 IN1/OUT1</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>TPGAPC3 IN2/OUT2</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.TPOSGGIO1" prefix="TPOS" lnClass="GGIO" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>TPOSSLTC1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Ind1">
							<DAI name="d">
								<Val>TPOSSLTC1 BI0</Val>
							</DAI>
						</DOI>
						<DOI name="Ind2">
							<DAI name="d">
								<Val>TPOSSLTC1 BI1</Val>
							</DAI>
						</DOI>
						<DOI name="Ind3">
							<DAI name="d">
								<Val>TPOSSLTC1 BI2</Val>
							</DAI>
						</DOI>
						<DOI name="Ind4">
							<DAI name="d">
								<Val>TPOSSLTC1 BI3</Val>
							</DAI>
						</DOI>
						<DOI name="Ind5">
							<DAI name="d">
								<Val>TPOSSLTC1 BI4</Val>
							</DAI>
						</DOI>
						<DOI name="Ind6">
							<DAI name="d">
								<Val>TPOSSLTC1 BI5</Val>
							</DAI>
						</DOI>
						<DOI name="Ind7">
							<DAI name="d">
								<Val>TPOSSLTC1 SIGN_BIT</Val>
							</DAI>
						</DOI>
						<DOI name="BinCdMod">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.TPOSSLTC1" prefix="TPOS" lnClass="SLTC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>TPOSSLTC1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="TapPos">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
							<DAI name="d">
								<Val>TPOSSLTC1 TAPPOS</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.TRPPTRC1" prefix="TRP" lnClass="PTRC" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>E</Val>
							</DAI>
							<DAI name="d">
								<Val>TRPPTRC1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Tr">
							<DAI name="d">
								<Val>TRPPTRC1 General trip output signal</Val>
							</DAI>
						</DOI>
						<DOI name="Op">
							<DAI name="d">
								<Val>TRPPTRC1 Operate input signal</Val>
							</DAI>
						</DOI>
						<DOI name="TrPlsTmms">
							<DAI name="minVal">
								<Val>20</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="stepSize">
								<Val>1</Val>
							</DAI>
							<DAI name="setVal">
								<Val>250</Val>
							</DAI>
						</DOI>
						<DOI name="TrOutMod">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="LORs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>TRPPTRC1 RST_LKOUT</Val>
							</DAI>
						</DOI>
						<DOI name="TrRs">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>TRPPTRC1 Reset latched trip</Val>
							</DAI>
						</DOI>
						<DOI name="ClsLO">
							<DAI name="d">
								<Val>TRPPTRC1 Circuit breaker lockout output (set until reset) </Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.UL1TVTR1" prefix="UL1" lnClass="TVTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Vol">
							<SDI name="sVC">
								<DAI name="scaleFactor">
									<Val>1.0</Val>
								</DAI>
								<DAI name="offset">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VRtg">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>V</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>440.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.001</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Rat">
							<SDI name="minVal">
								<DAI name="f">
									<Val>1000.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Cor">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.9</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.1</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="AngCor">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>-20.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VRtgScy">
							<SDI name="minVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>210.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>100.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VConnType">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="VInType">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>E</Val>
							</DAI>
							<DAI name="d">
								<Val>Voltage (3U,VT) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>Voltage (3U,VT) Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="Wrn">
							<DAI name="d">
								<Val>Voltage (3U,VT) Warning</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.UL1TVTR1" prefix="UL2" lnClass="TVTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Vol">
							<SDI name="sVC">
								<DAI name="scaleFactor">
									<Val>1.0</Val>
								</DAI>
								<DAI name="offset">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VRtg">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>V</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>440.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.001</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Rat">
							<SDI name="minVal">
								<DAI name="f">
									<Val>1000.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Cor">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.9</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.1</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="AngCor">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>-20.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VRtgScy">
							<SDI name="minVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>210.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>100.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VConnType">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="VInType">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>E</Val>
							</DAI>
							<DAI name="d">
								<Val>Voltage (3U,VT) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>Voltage (3U,VT) Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="Wrn">
							<DAI name="d">
								<Val>Voltage (3U,VT) Warning</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.UL1TVTR1" prefix="UL3" lnClass="TVTR" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="Vol">
							<SDI name="sVC">
								<DAI name="scaleFactor">
									<Val>1.0</Val>
								</DAI>
								<DAI name="offset">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VRtg">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>V</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>k</Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.1</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>440.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.001</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Rat">
							<SDI name="minVal">
								<DAI name="f">
									<Val>1000.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>10000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="Cor">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.9</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>1.1</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="AngCor">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>deg</Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<SDI name="minVal">
								<DAI name="f">
									<Val>-20.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>10.0e-05</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VRtgScy">
							<SDI name="minVal">
								<DAI name="f">
									<Val>60.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>210.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>100.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="VConnType">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="VInType">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>E</Val>
							</DAI>
							<DAI name="d">
								<Val>Voltage (3U,VT) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>Voltage (3U,VT) Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="Wrn">
							<DAI name="d">
								<Val>Voltage (3U,VT) Warning</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.VMMXU1" prefix="V" lnClass="MMXU" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>VMMXU1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="PPV">
							<SDI name="phsAB">
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
								<DAI name="zeroDb">
									<Val>250</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>1.4</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>1.2</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>4.0</Val>
										</DAI>
									</SDI>
								</SDI>
							</SDI>
							<SDI name="phsBC">
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
								<DAI name="zeroDb">
									<Val>250</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>1.4</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>1.2</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>4.0</Val>
										</DAI>
									</SDI>
								</SDI>
							</SDI>
							<SDI name="phsCA">
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
								<DAI name="zeroDb">
									<Val>250</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>1.4</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>1.2</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>4.0</Val>
										</DAI>
									</SDI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>VMMXU1 Phase to phase voltages</Val>
							</DAI>
						</DOI>
						<DOI name="PhV">
							<SDI name="phsA">
								<SDI name="units">
									<DAI name="SIUnit">
										<Val></Val>
									</DAI>
									<DAI name="multiplier">
										<Val></Val>
									</DAI>
								</SDI>
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
							</SDI>
							<DAI name="d">
								<Val>VMMXU1 Phase to ground voltages</Val>
							</DAI>
						</DOI>
						<DOI name="HiAlm">
							<DAI name="d">
								<Val>VMMXU1 High alarm</Val>
							</DAI>
						</DOI>
						<DOI name="HiWrn">
							<DAI name="d">
								<Val>VMMXU1 High warning</Val>
							</DAI>
						</DOI>
						<DOI name="LoWrn">
							<DAI name="d">
								<Val>VMMXU1 Low warning</Val>
							</DAI>
						</DOI>
						<DOI name="LoAlm">
							<DAI name="d">
								<Val>VMMXU1 Low alarm</Val>
							</DAI>
						</DOI>
						<DOI name="VMeasMod">
							<DAI name="setVal">
								<Val>2</Val>
							</DAI>
						</DOI>
						<DOI name="NumPh">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.VMSTA1" prefix="V" lnClass="MSTA" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>status-only</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>VMMXU1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="AvVPhsA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>VMMXU1 U_DMD_A</Val>
							</DAI>
						</DOI>
						<DOI name="AvVPhsB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>VMMXU1 U_DMD_B</Val>
							</DAI>
						</DOI>
						<DOI name="AvVPhsC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>VMMXU1 U_DMD_C</Val>
							</DAI>
						</DOI>
						<DOI name="AvVPhsAB">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>VMMXU1 U_DMD_AB</Val>
							</DAI>
						</DOI>
						<DOI name="AvVPhsBC">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>VMMXU1 U_DMD_BC</Val>
							</DAI>
						</DOI>
						<DOI name="AvVPhsCA">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="d">
								<Val>VMMXU1 U_DMD_CA</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.VSMSQI1" prefix="VS" lnClass="MSQI" inst="1">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>B</Val>
							</DAI>
							<DAI name="d">
								<Val>VSMSQI1 Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="SeqV">
							<SDI name="c1">
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
								<DAI name="zeroDb">
									<Val>250</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>1.4</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>1.2</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>4.0</Val>
										</DAI>
									</SDI>
								</SDI>
							</SDI>
							<SDI name="c2">
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
								<DAI name="zeroDb">
									<Val>250</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>0.2</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>0.05</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>4.0</Val>
										</DAI>
									</SDI>
								</SDI>
							</SDI>
							<SDI name="c3">
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
								<DAI name="zeroDb">
									<Val>250</Val>
								</DAI>
								<SDI name="rangeC">
									<SDI name="hhLim">
										<DAI name="f">
											<Val>0.2</Val>
										</DAI>
									</SDI>
									<SDI name="hLim">
										<DAI name="f">
											<Val>0.05</Val>
										</DAI>
									</SDI>
									<SDI name="lLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="llLim">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="min">
										<DAI name="f">
											<Val>0.0</Val>
										</DAI>
									</SDI>
									<SDI name="max">
										<DAI name="f">
											<Val>4.0</Val>
										</DAI>
									</SDI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>VSMSQI1 Positive, Negative and Zero Sequence Voltage</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.XAGGIO120" prefix="XA" lnClass="GGIO" inst="120">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C</Val>
							</DAI>
							<DAI name="d">
								<Val>X120 (AIM2) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EEName">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="hwRev">
								<Val>H</Val>
							</DAI>
							<DAI name="swRev">
								<Val>-</Val>
							</DAI>
							<DAI name="serNum">
								<Val>1YM192517192</Val>
							</DAI>
							<DAI name="model">
								<Val></Val>
							</DAI>
							<DAI name="location">
								<Val></Val>
							</DAI>
							<DAI name="eArtNum">
								<Val>2RAA005920A0006</Val>
							</DAI>
							<DAI name="eManDate">
								<Val>2016-07-26</Val>
							</DAI>
							<DAI name="eTestStatId">
								<Val>RTT26</Val>
							</DAI>
							<DAI name="eTesterId">
								<Val>12</Val>
							</DAI>
							<DAI name="eTestDate">
								<Val>2016-07-26</Val>
							</DAI>
							<DAI name="eHwId">
								<Val>AIMB04A</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.XGGIO100" prefix="X" lnClass="GGIO" inst="100">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>C1</Val>
							</DAI>
							<DAI name="d">
								<Val>X100 (PSM) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EEName">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="hwRev">
								<Val>R</Val>
							</DAI>
							<DAI name="swRev">
								<Val>-</Val>
							</DAI>
							<DAI name="serNum">
								<Val>1YM192645530</Val>
							</DAI>
							<DAI name="model">
								<Val></Val>
							</DAI>
							<DAI name="location">
								<Val></Val>
							</DAI>
							<DAI name="eArtNum">
								<Val>2RCA025059A0001</Val>
							</DAI>
							<DAI name="eManDate">
								<Val>2016-11-07</Val>
							</DAI>
							<DAI name="eTestStatId">
								<Val>RTR059</Val>
							</DAI>
							<DAI name="eTesterId">
								<Val>12</Val>
							</DAI>
							<DAI name="eTestDate">
								<Val>2016-11-07</Val>
							</DAI>
							<DAI name="eHwId">
								<Val>PSMB02A</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO1">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X100 (PSM) X100-Output 1</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO2">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X100 (PSM) X100-Output 2</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO3">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X100 (PSM) X100-Output 3</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO4">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X100 (PSM) X100-Output 4</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO5">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X100 (PSM) X100-Output 5</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO6">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X100 (PSM) X100-Output 6</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.XGGIO110" prefix="X" lnClass="GGIO" inst="110">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>D</Val>
							</DAI>
							<DAI name="d">
								<Val>X110 (BIO) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EEName">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="hwRev">
								<Val>E</Val>
							</DAI>
							<DAI name="swRev">
								<Val>-</Val>
							</DAI>
							<DAI name="serNum">
								<Val>1YM192637989</Val>
							</DAI>
							<DAI name="model">
								<Val></Val>
							</DAI>
							<DAI name="location">
								<Val></Val>
							</DAI>
							<DAI name="eArtNum">
								<Val>2RCA025501A0001</Val>
							</DAI>
							<DAI name="eManDate">
								<Val>2016-10-28</Val>
							</DAI>
							<DAI name="eTestStatId">
								<Val>RTT027</Val>
							</DAI>
							<DAI name="eTesterId">
								<Val>12</Val>
							</DAI>
							<DAI name="eTestDate">
								<Val>2016-10-28</Val>
							</DAI>
							<DAI name="eHwId">
								<Val>BIOB03A</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO1">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X110 (BIO) X110-Output 1</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO2">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X110 (BIO) X110-Output 2</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO3">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X110 (BIO) X110-Output 3</Val>
							</DAI>
						</DOI>
						<DOI name="SPCSO4">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X110 (BIO) X110-Output 4</Val>
							</DAI>
						</DOI>
						<DOI name="Ind1">
							<DAI name="d">
								<Val>X110 (BIO) X110-Input 1</Val>
							</DAI>
						</DOI>
						<DOI name="Ind2">
							<DAI name="d">
								<Val>X110 (BIO) X110-Input 2</Val>
							</DAI>
						</DOI>
						<DOI name="Ind3">
							<DAI name="d">
								<Val>X110 (BIO) X110-Input 3</Val>
							</DAI>
						</DOI>
						<DOI name="Ind4">
							<DAI name="d">
								<Val>X110 (BIO) X110-Input 4</Val>
							</DAI>
						</DOI>
						<DOI name="Ind5">
							<DAI name="d">
								<Val>X110 (BIO) X110-Input 5</Val>
							</DAI>
						</DOI>
						<DOI name="Ind6">
							<DAI name="d">
								<Val>X110 (BIO) X110-Input 6</Val>
							</DAI>
						</DOI>
						<DOI name="Ind7">
							<DAI name="d">
								<Val>X110 (BIO) X110-Input 7</Val>
							</DAI>
						</DOI>
						<DOI name="Ind8">
							<DAI name="d">
								<Val>X110 (BIO) X110-Input 8</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms1">
							<DAI name="minVal">
								<Val>5</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>1000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>5</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms2">
							<DAI name="minVal">
								<Val>5</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>1000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>5</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms3">
							<DAI name="minVal">
								<Val>5</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>1000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>5</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms4">
							<DAI name="minVal">
								<Val>5</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>1000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>5</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms5">
							<DAI name="minVal">
								<Val>5</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>1000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>5</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms6">
							<DAI name="minVal">
								<Val>5</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>1000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>5</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms7">
							<DAI name="minVal">
								<Val>5</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>1000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>5</Val>
							</DAI>
						</DOI>
						<DOI name="OpDlTmms8">
							<DAI name="minVal">
								<Val>5</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>1000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>5</Val>
							</DAI>
						</DOI>
						<DOI name="DiInvert1">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="DiInvert2">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="DiInvert3">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="DiInvert4">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="DiInvert5">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="DiInvert6">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="DiInvert7">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="DiInvert8">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.XGGIO90" prefix="X" lnClass="GGIO" inst="90">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
						</DOI>
						<DOI name="FibMod1">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="SerMod1">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="CtsDlTmms1">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="RtsDlTmms1">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="SerBaud1">
							<DAI name="setVal">
								<Val>6</Val>
							</DAI>
						</DOI>
						<DOI name="FibMod2">
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="SerMod2">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="CtsDlTmms2">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="RtsDlTmms2">
							<DAI name="minVal">
								<Val>0</Val>
							</DAI>
							<DAI name="maxVal">
								<Val>60000</Val>
							</DAI>
							<DAI name="setVal">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>E</Val>
							</DAI>
							<DAI name="d">
								<Val>X000 (COM) X90</Val>
							</DAI>
						</DOI>
						<DOI name="EEName">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="hwRev">
								<Val>H</Val>
							</DAI>
							<DAI name="swRev">
								<Val>-</Val>
							</DAI>
							<DAI name="serNum">
								<Val>1YF192423472</Val>
							</DAI>
							<DAI name="model">
								<Val></Val>
							</DAI>
							<DAI name="location">
								<Val></Val>
							</DAI>
							<DAI name="eArtNum">
								<Val>2RAA005844A0005</Val>
							</DAI>
							<DAI name="eManDate">
								<Val>2016-08-24</Val>
							</DAI>
							<DAI name="eTestStatId">
								<Val>RTT15</Val>
							</DAI>
							<DAI name="eTesterId">
								<Val>12</Val>
							</DAI>
							<DAI name="eTestDate">
								<Val>2016-08-24</Val>
							</DAI>
							<DAI name="eHwId">
								<Val>COMB02A</Val>
							</DAI>
						</DOI>
						<DOI name="Status1">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X000 (COM) Status of the link</Val>
							</DAI>
						</DOI>
						<DOI name="Status2">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="d">
								<Val>X000 (COM) Status of the link</Val>
							</DAI>
						</DOI>
						<DOI name="EthLnkLiv1">
							<DAI name="d">
								<Val>X000 (COM) Link status of the Ethernet port 1</Val>
							</DAI>
						</DOI>
						<DOI name="EthLnkLiv2">
							<DAI name="d">
								<Val>X000 (COM) Link status of the Ethernet port 2</Val>
							</DAI>
						</DOI>
						<DOI name="EthLnkLiv3">
							<DAI name="d">
								<Val>X000 (COM) Link status of the Ethernet port 3</Val>
							</DAI>
						</DOI>
						<DOI name="SerBaud2">
							<DAI name="setVal">
								<Val>6</Val>
							</DAI>
						</DOI>
						<DOI name="EthSwMod">
							<DAI name="d">
								<Val>X000 (COM) Ethernet switch mode</Val>
							</DAI>
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
					</LN>
					<LN lnType="AA1E1Q01KF2LD0.XRGGIO130" prefix="XR" lnClass="GGIO" inst="130">
						<DOI name="Mod">
							<DAI name="ctlModel">
								<Val>direct-with-normal-security</Val>
							</DAI>
							<DAI name="blockIn">
								<Val>0</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="swRev">
								<Val>B</Val>
							</DAI>
							<DAI name="d">
								<Val>X130 (RTD) Name plate</Val>
							</DAI>
						</DOI>
						<DOI name="EEName">
							<DAI name="vendor">
								<Val></Val>
							</DAI>
							<DAI name="hwRev">
								<Val>J</Val>
							</DAI>
							<DAI name="swRev">
								<Val>-</Val>
							</DAI>
							<DAI name="serNum">
								<Val>1YM192518158</Val>
							</DAI>
							<DAI name="model">
								<Val></Val>
							</DAI>
							<DAI name="location">
								<Val></Val>
							</DAI>
							<DAI name="eArtNum">
								<Val>2RCA022949A0001</Val>
							</DAI>
							<DAI name="eManDate">
								<Val>2016-07-27</Val>
							</DAI>
							<DAI name="eTestStatId">
								<Val>RTT26</Val>
							</DAI>
							<DAI name="eTesterId">
								<Val>12</Val>
							</DAI>
							<DAI name="eTestDate">
								<Val>2016-07-27</Val>
							</DAI>
							<DAI name="eHwId">
								<Val>RTDB01A</Val>
							</DAI>
						</DOI>
						<DOI name="AnIn1">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val>m</Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>100</Val>
							</DAI>
							<SDI name="rangeC">
								<SDI name="hhLim">
									<DAI name="f">
										<Val>17.0</Val>
									</DAI>
								</SDI>
								<SDI name="hLim">
									<DAI name="f">
										<Val>17.0</Val>
									</DAI>
								</SDI>
								<SDI name="lLim">
									<DAI name="f">
										<Val>1.0</Val>
									</DAI>
								</SDI>
								<SDI name="llLim">
									<DAI name="f">
										<Val>1.0</Val>
									</DAI>
								</SDI>
								<SDI name="min">
									<DAI name="f">
										<Val>1.0</Val>
									</DAI>
								</SDI>
								<SDI name="max">
									<DAI name="f">
										<Val>17.0</Val>
									</DAI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>X130 (RTD) Analogue input 1</Val>
							</DAI>
						</DOI>
						<DOI name="AnIn2">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val>°C</Val>
								</DAI>
								<DAI name="multiplier">
									<Val>m</Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>100</Val>
							</DAI>
							<SDI name="rangeC">
								<SDI name="hhLim">
									<DAI name="f">
										<Val>140.0</Val>
									</DAI>
								</SDI>
								<SDI name="hLim">
									<DAI name="f">
										<Val>140.0</Val>
									</DAI>
								</SDI>
								<SDI name="lLim">
									<DAI name="f">
										<Val>0.0</Val>
									</DAI>
								</SDI>
								<SDI name="llLim">
									<DAI name="f">
										<Val>0.0</Val>
									</DAI>
								</SDI>
								<SDI name="min">
									<DAI name="f">
										<Val>-20.0</Val>
									</DAI>
								</SDI>
								<SDI name="max">
									<DAI name="f">
										<Val>140.0</Val>
									</DAI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>X130 (RTD) Analogue input 2</Val>
							</DAI>
						</DOI>
						<DOI name="AnIn3">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>1000</Val>
							</DAI>
							<SDI name="rangeC">
								<SDI name="hhLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="hLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="lLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="llLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="min">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="max">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>X130 (RTD) Analogue input 3</Val>
							</DAI>
						</DOI>
						<DOI name="AnIn4">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>1000</Val>
							</DAI>
							<SDI name="rangeC">
								<SDI name="hhLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="hLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="lLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="llLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="min">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="max">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>X130 (RTD) Analogue input 4</Val>
							</DAI>
						</DOI>
						<DOI name="AnIn5">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>1000</Val>
							</DAI>
							<SDI name="rangeC">
								<SDI name="hhLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="hLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="lLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="llLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="min">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="max">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>X130 (RTD) Analogue input 5</Val>
							</DAI>
						</DOI>
						<DOI name="AnIn6">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>1000</Val>
							</DAI>
							<SDI name="rangeC">
								<SDI name="hhLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="hLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="lLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="llLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="min">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="max">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>X130 (RTD) Analogue input 6</Val>
							</DAI>
						</DOI>
						<DOI name="AnIn7">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>1000</Val>
							</DAI>
							<SDI name="rangeC">
								<SDI name="hhLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="hLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="lLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="llLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="min">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="max">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>X130 (RTD) Analogue input 7</Val>
							</DAI>
						</DOI>
						<DOI name="AnIn8">
							<SDI name="units">
								<DAI name="SIUnit">
									<Val></Val>
								</DAI>
								<DAI name="multiplier">
									<Val></Val>
								</DAI>
							</SDI>
							<DAI name="db">
								<Val>1000</Val>
							</DAI>
							<SDI name="rangeC">
								<SDI name="hhLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="hLim">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="lLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="llLim">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="min">
									<DAI name="f">
										<Val>-10000.0</Val>
									</DAI>
								</SDI>
								<SDI name="max">
									<DAI name="f">
										<Val>10000.0</Val>
									</DAI>
								</SDI>
							</SDI>
							<DAI name="d">
								<Val>X130 (RTD) Analogue input 8</Val>
							</DAI>
						</DOI>
						<DOI name="Alm">
							<DAI name="d">
								<Val>X130 (RTD) Alarm</Val>
							</DAI>
						</DOI>
						<DOI name="Wrn">
							<DAI name="d">
								<Val>X130 (RTD) Warning</Val>
							</DAI>
						</DOI>
						<DOI name="InMinVal1">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>4.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMinVal2">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>4.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMinVal3">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMinVal4">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMinVal5">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMinVal6">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMinVal7">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMinVal8">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMaxVal1">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMaxVal2">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>20.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMaxVal3">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMaxVal4">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMaxVal5">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMaxVal6">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMaxVal7">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMaxVal8">
							<SDI name="minVal">
								<DAI name="f">
									<Val>0.0</Val>
								</DAI>
							</SDI>
							<SDI name="maxVal">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
							<SDI name="stepSize">
								<DAI name="f">
									<Val>1.0</Val>
								</DAI>
							</SDI>
							<SDI name="setMag">
								<DAI name="f">
									<Val>2000.0</Val>
								</DAI>
							</SDI>
						</DOI>
						<DOI name="InMod1">
							<DAI name="setVal">
								<Val>5</Val>
							</DAI>
						</DOI>
						<DOI name="InMod2">
							<DAI name="setVal">
								<Val>5</Val>
							</DAI>
						</DOI>
						<DOI name="InMod3">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="InMod4">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="InMod5">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="InMod6">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="InMod7">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
						<DOI name="InMod8">
							<DAI name="setVal">
								<Val>1</Val>
							</DAI>
						</DOI>
					</LN>
				</LDevice>
			</Server>
		</AccessPoint>
	</IED>
	<DataTypeTemplates>
		<LNodeType id="AA1E1Q01KF2LD0.CCRDIF1" lnClass="RDIF">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Op" type="AA1E1Q01KF2LD0.CCRDIF1.Op" />
			<DO name="Alm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="StrVal" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="MaxOpA" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="TstOutCmd" type="AA1E1Q01KF2LD0.LLN0.CpySG" />
			<DO name="DifAClc" type="AA1E1Q01KF2LD0.CCRDIF1.DifAClc" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.DIAGLCCH1" lnClass="LCCH">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="ChLiv" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="RedChLiv" type="AA1E1Q01KF2DR.RBDR1.EInput" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.GNRLLTMS1" lnClass="LTMS">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="TmAcc" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="TmSrcSt" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="TmSyn" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="TmSrcSel1" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="DomId" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="PTPPrio1" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="PTPPrio2" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="NamPlt" type="AA1E1Q01KF2LD0.GNRLLTMS1.NamPlt" />
			<DO name="TmChSt1" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Alm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Wrn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="PTPTmSrc" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="PTPClkAcc" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="LocClkAcc" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="MaxDevAcc" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.SEQRFUF1" lnClass="RFUF">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Str" type="AA1E1Q01KF2LD0.SEQRFUF1.Str" />
			<DO name="Str3Ph" type="AA1E1Q01KF2LD0.SEQRFUF1.Str" />
			<DO name="InPosCls" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="InDCPosOpn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="InMCBPsOpn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="BlkValA" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="NgSeqLevA" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="ChgRteA" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="ChgRteEna" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="ChgRteV" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="EnaSealIn" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="BlkValV" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="SealInV" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="NgSeqLevV" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="TstOutCmd" type="AA1E1Q01KF2LD0.LLN0.CpySG" />
			<DO name="DeaLinValA" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.TCSSCBR1" lnClass="SCBR">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="CirAlm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="OpDlTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="RsDlTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="TstOutCmd" type="AA1E1Q01KF2LD0.LLN0.CpySG" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.TPOSSLTC1" lnClass="SLTC">
			<DO name="Mod" type="AA1E1Q01KF2DR.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="TapPos" type="AA1E1Q01KF2LD0.TPOSSLTC1.TapPos" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.TPGAPC1" lnClass="GAPC">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="PlsTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Str" type="AA1E1Q01KF2LD0.SEQRFUF1.Str" />
			<DO name="Op" type="AA1E1Q01KF2LD0.CCRDIF1.Op" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.GSEGGIO1" lnClass="GGIO">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="IntIn1" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn2" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn3" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn4" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn5" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn6" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn7" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn8" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn9" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn10" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn11" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="Alm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="RstCnt" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.LEDGGIO1" lnClass="GGIO">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="ISCSO1" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="ISCSO2" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="ISCSO3" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="ISCSO4" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="ISCSO5" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="ISCSO6" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="ISCSO7" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="ISCSO8" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="ISCSO9" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="ISCSO10" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="ISCSO11" type="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" />
			<DO name="Alm1" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Alm2" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Alm3" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Alm4" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Alm5" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Alm6" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Alm7" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Alm8" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Alm9" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Alm10" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Alm11" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind1" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind2" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind3" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind4" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind5" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind6" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind7" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind8" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind9" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind10" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="Ind11" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED1" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED2" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED3" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED4" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED5" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED6" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED7" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED8" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED9" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED10" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="InRsLED11" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="LEDSeq1" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LEDSeq2" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LEDSeq3" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LEDSeq4" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LEDSeq5" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LEDSeq6" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LEDSeq7" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LEDSeq8" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LEDSeq9" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LEDSeq10" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LEDSeq11" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="AlmColr" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.MMSGGIO1" lnClass="GGIO">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2LD0.MMSGGIO1.NamPlt" />
			<DO name="IntIn1" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn2" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn3" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn4" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn5" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn6" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn7" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn8" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn9" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn10" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn11" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn12" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn13" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="IntIn14" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="SGConfMod" type="AA1E1Q01KF2LD0.MMSGGIO1.SGConfMod" />
			<DO name="Status" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="UnitMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="StdCnf1" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="StdCnf2" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.SPCGGIO1" lnClass="GGIO">
			<DO name="Mod" type="AA1E1Q01KF2LD0.SPCGGIO1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="SPCSO1" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO2" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO3" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO4" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO5" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO6" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO7" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO8" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO9" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO10" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO11" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO12" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO13" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO14" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO15" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="SPCSO16" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" />
			<DO name="LocRemRst" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.TPOSGGIO1" lnClass="GGIO">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Ind1" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind2" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind3" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind4" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind5" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind6" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind7" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="BinCdMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.XAGGIO120" lnClass="GGIO">
			<DO name="Mod" type="AA1E1Q01KF2DR.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="EEName" type="AA1E1Q01KF2LD0.IHMI1.EEName" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.XGGIO100" lnClass="GGIO">
			<DO name="Mod" type="AA1E1Q01KF2DR.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="EEName" type="AA1E1Q01KF2LD0.IHMI1.EEName" />
			<DO name="SPCSO1" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="SPCSO2" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="SPCSO3" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="SPCSO4" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="SPCSO5" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="SPCSO6" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.XGGIO110" lnClass="GGIO">
			<DO name="Mod" type="AA1E1Q01KF2DR.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="EEName" type="AA1E1Q01KF2LD0.IHMI1.EEName" />
			<DO name="SPCSO1" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="SPCSO2" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="SPCSO3" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="SPCSO4" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="Ind1" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind2" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind3" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind4" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind5" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind6" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind7" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Ind8" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="OpDlTmms1" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="OpDlTmms2" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="OpDlTmms3" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="OpDlTmms4" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="OpDlTmms5" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="OpDlTmms6" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="OpDlTmms7" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="OpDlTmms8" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="DiInvert1" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="DiInvert2" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="DiInvert3" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="DiInvert4" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="DiInvert5" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="DiInvert6" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="DiInvert7" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="DiInvert8" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.XGGIO90" lnClass="GGIO">
			<DO name="Mod" type="AA1E1Q01KF2DR.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="ChrsRcv1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="LnkFrOk1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="LnkFrErr1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="LnkFrTrm1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="CDLost1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="Collision1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="CTSTmOut1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="TxTmOut1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="ParErr1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="OvrErr1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="FrmErr1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="FibMod1" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="SerMod1" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="CtsDlTmms1" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="RtsDlTmms1" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="SerBaud1" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="FibMod2" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="SerMod2" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="CtsDlTmms2" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="RtsDlTmms2" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="EEName" type="AA1E1Q01KF2LD0.IHMI1.EEName" />
			<DO name="Status1" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="ChrsRcv2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="LnkFrOk2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="LnkFrErr2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="LnkFrTrm2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="CDLost2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="Collision2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="CTSTmOut2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="TxTmOut2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="ParErr2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="OvrErr2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="FrmErr2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="Status2" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="EthLnkLiv1" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="EthLnkLiv2" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="EthLnkLiv3" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="SerBaud2" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="EthSwMod" type="AA1E1Q01KF2DR.RADR1.EChNum" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.XRGGIO130" lnClass="GGIO">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="EEName" type="AA1E1Q01KF2LD0.IHMI1.EEName" />
			<DO name="AnIn1" type="AA1E1Q01KF2LD0.XRGGIO130.AnIn1" />
			<DO name="AnIn2" type="AA1E1Q01KF2LD0.XRGGIO130.AnIn1" />
			<DO name="AnIn3" type="AA1E1Q01KF2LD0.XRGGIO130.AnIn1" />
			<DO name="AnIn4" type="AA1E1Q01KF2LD0.XRGGIO130.AnIn1" />
			<DO name="AnIn5" type="AA1E1Q01KF2LD0.XRGGIO130.AnIn1" />
			<DO name="AnIn6" type="AA1E1Q01KF2LD0.XRGGIO130.AnIn1" />
			<DO name="AnIn7" type="AA1E1Q01KF2LD0.XRGGIO130.AnIn1" />
			<DO name="AnIn8" type="AA1E1Q01KF2LD0.XRGGIO130.AnIn1" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="Alm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Wrn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="InMinVal1" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMinVal2" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMinVal3" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMinVal4" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMinVal5" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMinVal6" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMinVal7" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMinVal8" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMaxVal1" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMaxVal2" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMaxVal3" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMaxVal4" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMaxVal5" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMaxVal6" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMaxVal7" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMaxVal8" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="InMod1" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="InMod2" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="InMod3" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="InMod4" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="InMod5" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="InMod6" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="InMod7" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="InMod8" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.GSAL1" lnClass="GSAL">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="OpCntRs" type="AA1E1Q01KF2LD0.FLTMSTA1.ActSG" />
			<DO name="NumCntRs" type="AA1E1Q01KF2LD0.FLTMSTA1.ActSG" />
			<DO name="AuthFail" type="AA1E1Q01KF2LD0.GSAL1.AuthFail" />
			<DO name="AcsCtlFail" type="AA1E1Q01KF2LD0.GSAL1.AuthFail" />
			<DO name="SvcViol" type="AA1E1Q01KF2LD0.GSAL1.AuthFail" />
			<DO name="Ina" type="AA1E1Q01KF2LD0.GSAL1.AuthFail" />
			<DO name="AuthLoc" type="AA1E1Q01KF2LD0.GSAL1.AuthLoc" />
			<DO name="AuthRem" type="AA1E1Q01KF2LD0.GSAL1.AuthLoc" />
			<DO name="AuthAcsLev" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="SecCommEna" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="RemUpdEna" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="AuthAcsA" type="AA1E1Q01KF2LD0.GSAL1.AuthAcsA" />
			<DO name="AuthAcsB" type="AA1E1Q01KF2LD0.GSAL1.AuthAcsA" />
			<DO name="AuthAcsC" type="AA1E1Q01KF2LD0.GSAL1.AuthAcsA" />
			<DO name="AuthAcsD" type="AA1E1Q01KF2LD0.GSAL1.AuthAcsA" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.IHMI1" lnClass="IHMI">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="EEName" type="AA1E1Q01KF2LD0.IHMI1.EEName" />
			<DO name="LocClk" type="AA1E1Q01KF2LD0.IHMI1.LocClk" />
			<DO name="Lang" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LangFile" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="Contr" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="NumForm" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="BackLight" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="EFrmT" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="EFrmD" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="NamCnv" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="DefView" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="WhmiMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="WhmiTout" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="DisTest" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="EvClr" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="ESldSymFor" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="ScrDlTms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="CBClsDlMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="CBClsDlTms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="SetVsb" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2CTRL.LLN0" lnClass="LLN0">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="LocKey" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="LocSta" type="AA1E1Q01KF2CTRL.LLN0.LocSta" />
			<DO name="Loc" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="CmdRsp" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="LocRem" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="LocKeyDis" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="LocKeyLoc" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="LocKeyRem" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="LocKeySta" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="NamPlt" type="AA1E1Q01KF2CTRL.LLN0.NamPlt" />
			<DO name="LocRemMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="StaAuth" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2DR.LLN0" lnClass="LLN0">
			<DO name="Mod" type="AA1E1Q01KF2DR.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2CTRL.LLN0.NamPlt" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.LLN0" lnClass="LLN0">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2LD0.LLN0.NamPlt" />
			<DO name="LEDRs1" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="LEDRs2" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="MtrRecRs" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="PQRs" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="SetSeld" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="SetChg" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="BlkMode" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="HzSetE" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="PhRotSet" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="DiVThres" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="DiOscThres" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="DiOscHyst" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="CpySG" type="AA1E1Q01KF2LD0.LLN0.CpySG" />
			<DO name="ActSG" type="AA1E1Q01KF2LD0.LLN0.ActSG" />
			<DO name="Act1SG" type="AA1E1Q01KF2LD0.LLN0.Act1SG" />
			<DO name="Act2SG" type="AA1E1Q01KF2LD0.LLN0.Act1SG" />
			<DO name="Act3SG" type="AA1E1Q01KF2LD0.LLN0.Act1SG" />
			<DO name="Act4SG" type="AA1E1Q01KF2LD0.LLN0.Act1SG" />
			<DO name="Act5SG" type="AA1E1Q01KF2LD0.LLN0.Act1SG" />
			<DO name="Act6SG" type="AA1E1Q01KF2LD0.LLN0.Act1SG" />
			<DO name="LgcSelSG" type="AA1E1Q01KF2LD0.LLN0.Act1SG" />
			<DO name="OpModSG" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="PhOrdMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="ACrvSatPnt" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="SvMaxDl" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="SvAvDl" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="ADmdAvMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="MtrDmdItrv" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="HzAdEna" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="SetSvMaxDl" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2CTRL.LPHD1" lnClass="LPHD">
			<DO name="PhyHealth" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="Proxy" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="PhyNam" type="AA1E1Q01KF2CTRL.LPHD1.PhyNam" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.LPHD1" lnClass="LPHD">
			<DO name="PhyNam" type="AA1E1Q01KF2LD0.LPHD1.PhyNam" />
			<DO name="PhyHealth" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="PhyHealth1" type="AA1E1Q01KF2LD0.LPHD1.PhyHealth1" />
			<DO name="PhyHealth2" type="AA1E1Q01KF2LD0.LPHD1.PhyHealth2" />
			<DO name="OutOv" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="OutOv1" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Proxy" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="NumPwrUp" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="WrmStr" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="WacTrg" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="PwrUp" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="PwrDn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="PwrDn1" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="NumCmpChg" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="EEName" type="AA1E1Q01KF2LD0.IHMI1.EEName" />
			<DO name="ChgFlg" type="AA1E1Q01KF2LD0.LLN0.ActSG" />
			<DO name="DevTmp" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="RsDev" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="IrfTst" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="FacSet" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.PEMMTR1" lnClass="MMTR">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="SupWh" type="AA1E1Q01KF2LD0.PEMMTR1.SupWh" />
			<DO name="SupVArh" type="AA1E1Q01KF2LD0.PEMMTR1.SupWh" />
			<DO name="DmdWh" type="AA1E1Q01KF2LD0.PEMMTR1.SupWh" />
			<DO name="DmdVArh" type="AA1E1Q01KF2LD0.PEMMTR1.SupWh" />
			<DO name="IniDmdWh" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="IniSupWh" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="IniDmdVArh" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="IniSupVArh" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="SupDmdRs" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.CMMXU1" lnClass="MMXU">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="A" type="AA1E1Q01KF2LD0.CMMXU1.A" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="HiAlm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="HiWrn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="LoWrn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="LoAlm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="AMeasMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="NumPh" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.PEMMXU1" lnClass="MMXU">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="TotW" type="AA1E1Q01KF2LD0.PEMMXU1.TotW" />
			<DO name="TotVAr" type="AA1E1Q01KF2LD0.PEMMXU1.TotW" />
			<DO name="TotVA" type="AA1E1Q01KF2LD0.PEMMXU1.TotW" />
			<DO name="TotPF" type="AA1E1Q01KF2LD0.PEMMXU1.TotW" />
			<DO name="WhDir" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="VArhDir" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.VMMXU1" lnClass="MMXU">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="PPV" type="AA1E1Q01KF2LD0.VMMXU1.PPV" />
			<DO name="PhV" type="AA1E1Q01KF2LD0.VMMXU1.PhV" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="HiAlm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="HiWrn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="LoWrn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="LoAlm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="VMeasMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="NumPh" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.CSMSQI1" lnClass="MSQI">
			<DO name="Mod" type="AA1E1Q01KF2DR.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="SeqA" type="AA1E1Q01KF2LD0.CSMSQI1.SeqA" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.VSMSQI1" lnClass="MSQI">
			<DO name="Mod" type="AA1E1Q01KF2DR.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="SeqV" type="AA1E1Q01KF2LD0.CSMSQI1.SeqA" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.CMSTA1" lnClass="MSTA">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="AvAmpsA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MinAmpsA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AvAmpsB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MinAmpsB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AvAmpsC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MinAmpsC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="RecRs" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.FLTMSTA1" lnClass="MSTA">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Hz" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="FltZ" type="AA1E1Q01KF2LD0.CCRDIF1.DifAClc.res" />
			<DO name="FltDiskm" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="OpCnt" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="InOp" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="InStr" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="RecRs" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="SelRow" type="AA1E1Q01KF2LD0.LLN0.ActSG" />
			<DO name="StrDur" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="OpTm" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="ProFcn" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="ActSG" type="AA1E1Q01KF2LD0.FLTMSTA1.ActSG" />
			<DO name="ShotPntr" type="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" />
			<DO name="MxDifAClcA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MxDifAClcB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MxDifAClcC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MxRstAClcA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MxRstAClcB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MxRstAClcC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifAmpsA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifAmpsB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifAmpsC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="RstAmpsA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="RstAmpsB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="RstAmpsC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifAmpsN" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="RstAmpsN" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsN" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsN" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsNClc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsPsSeq" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsNgSeq" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsAb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsBb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsCb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsNb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsAb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsBb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsCb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsNb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsNClcb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsPsSeqb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsNgSeqb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsAc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsBc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsCc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxAmpsNc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsAc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsBc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsCc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsNc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsNClcc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsPsSeqc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AmpsNgSeqc" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsAB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsBC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsCA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsN" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VZroSeq" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VPsSeq" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VNgSeq" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsAb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsBb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsCb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsABb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsBCb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsCAb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VoltsNb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VZroSeqb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VPsSeqb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="VNgSeqb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxTmpRl" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="PDNS1MxRat" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifNAngN" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifAAngBC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifBAngCA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifCAngAB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifNAngNb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifAAngBCb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifBAngCAb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="DifCAngABb" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="HzS" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="CondN" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="SusN" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="PPLoopRis" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="PPLoopReac" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="InCBClr" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="CBClrTm" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="TrgSet" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="AMeasMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.LDPMSTA1" lnClass="MSTA">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="MemUsed" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="RecRs" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="MemWrn" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="MemAlm" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="QtySel1" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel2" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel3" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel4" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel5" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel6" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel7" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel8" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel9" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel10" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel11" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="QtySel12" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="MemWrnLev" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="MemAlmLev" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.PEMSTA1" lnClass="MSTA">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="AvVA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxVA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MinVA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AvW" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxW" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MinW" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AvVAr" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MaxVAr" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="MinVAr" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AvPF" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="RecRs" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.VMSTA1" lnClass="MSTA">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="AvVPhsA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AvVPhsB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AvVPhsC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AvVPhsAB" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AvVPhsBC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AvVPhsCA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.PHHPTOC1" lnClass="PTOC">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="TmACrv" type="AA1E1Q01KF2LD0.PHHPTOC1.TmACrv" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="StrVal" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="TmMult" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="MinOpTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="OpDlTmms" type="AA1E1Q01KF2LD0.OLATCC1.CtlDlTmms1" />
			<DO name="RsDlTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="TypRsCrv" type="AA1E1Q01KF2LD0.PHHPTOC1.TypRsCrv" />
			<DO name="NumPh" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="AMeasMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="StrValMult" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Str" type="AA1E1Q01KF2LD0.PHHPTOC1.Str" />
			<DO name="Op" type="AA1E1Q01KF2LD0.PHHPTOC1.Op" />
			<DO name="InEnaMult" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="StrDur" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="TstOutCmd" type="AA1E1Q01KF2LD0.LLN0.CpySG" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.PHIPTOC1" lnClass="PTOC">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="StrVal" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="OpDlTmms" type="AA1E1Q01KF2LD0.OLATCC1.CtlDlTmms1" />
			<DO name="RsDlTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="NumPh" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="StrValMult" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Str" type="AA1E1Q01KF2LD0.PHHPTOC1.Str" />
			<DO name="Op" type="AA1E1Q01KF2LD0.PHHPTOC1.Op" />
			<DO name="InEnaMult" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="StrDur" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="TstOutCmd" type="AA1E1Q01KF2LD0.LLN0.CpySG" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.PHPTOV1" lnClass="PTOV">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="TmVCrv" type="AA1E1Q01KF2LD0.PHHPTOC1.TmACrv" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="StrVal" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="TmMult" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="MinOpTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="OpDlTmms" type="AA1E1Q01KF2LD0.OLATCC1.CtlDlTmms1" />
			<DO name="TypRsCrv" type="AA1E1Q01KF2LD0.OLATCC1.ParTraMod" />
			<DO name="RsDlTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Str" type="AA1E1Q01KF2LD0.PHHPTOC1.Str" />
			<DO name="Op" type="AA1E1Q01KF2LD0.PHHPTOC1.Op" />
			<DO name="StrDur" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="TstOutCmd" type="AA1E1Q01KF2LD0.LLN0.CpySG" />
			<DO name="NumPh" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="CrvSatRl" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="VSel" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="HysRl" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.LEDPTRC1" lnClass="PTRC">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Op" type="AA1E1Q01KF2LD0.LEDPTRC1.Op" />
			<DO name="Str" type="AA1E1Q01KF2LD0.LEDPTRC1.Str" />
			<DO name="InRs" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.TRPPTRC1" lnClass="PTRC">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Tr" type="AA1E1Q01KF2LD0.CCRDIF1.Op" />
			<DO name="Op" type="AA1E1Q01KF2LD0.CCRDIF1.Op" />
			<DO name="TrPlsTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="TrOutMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LORs" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="TrRs" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="ClsLO" type="AA1E1Q01KF2DR.RBDR1.EInput" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.T2PTTR1" lnClass="PTTR">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Tmp" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="TmpRl" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="Str" type="AA1E1Q01KF2LD0.SEQRFUF1.Str" />
			<DO name="Op" type="AA1E1Q01KF2LD0.CCRDIF1.Op" />
			<DO name="AlmThm" type="AA1E1Q01KF2LD0.T2PTTR1.AlmThm" />
			<DO name="TmpMax" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="ConsTms1" type="AA1E1Q01KF2LD0.OLATCC1.CtlDlTmms1" />
			<DO name="ConsTms2" type="AA1E1Q01KF2LD0.OLATCC1.CtlDlTmms1" />
			<DO name="AlmVal" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="RsTmp" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="InhRec" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="TmpUsed" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="ARef" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="EnvTmpSet" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="IniTmp" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="RecTmpSet" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="TmpR" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="TstOutCmd" type="AA1E1Q01KF2LD0.LLN0.CpySG" />
			<DO name="TmsOp" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="TmsRecEna" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="WghFact" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="OpTmp" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.PHPTUV1" lnClass="PTUV">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="TmVCrv" type="AA1E1Q01KF2LD0.PHHPTOC1.TmACrv" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="StrVal" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="TmMult" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="MinOpTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="OpDlTmms" type="AA1E1Q01KF2LD0.OLATCC1.CtlDlTmms1" />
			<DO name="TypRsCrv" type="AA1E1Q01KF2LD0.OLATCC1.ParTraMod" />
			<DO name="RsDlTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="BlkVal" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Str" type="AA1E1Q01KF2LD0.PHHPTOC1.Str" />
			<DO name="Op" type="AA1E1Q01KF2LD0.PHHPTOC1.Op" />
			<DO name="StrDur" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="TstOutCmd" type="AA1E1Q01KF2LD0.LLN0.CpySG" />
			<DO name="NumPh" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="CrvSatRl" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="VSel" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="EnaBlkVal" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="HysRl" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2DR.RADR1" lnClass="RADR">
			<DO name="Mod" type="AA1E1Q01KF2DR.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="ChTrg" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="EExclTRem" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="HiTrgLev" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="LoTrgLev" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="EChNum" type="AA1E1Q01KF2DR.RADR1.EChNum" />
			<DO name="EStoMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2DR.RBDR1" lnClass="RBDR">
			<DO name="Mod" type="AA1E1Q01KF2DR.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="ChTrg" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="EExclTRem" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="EInput" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="LevMod" type="AA1E1Q01KF2DR.RBDR1.LevMod" />
			<DO name="EStoMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2DR.RDRE1" lnClass="RDRE">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="RcdTrg" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="MemClr" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="RcdMade" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="FltNum" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="RcdStr" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="MemUsed" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="ERcdStored" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="ERcdDelete" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="EMaxNumRcd" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="EMemFull" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="EOwRcd" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="EPerTRem" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="EPerTrg" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="EManTrg" type="AA1E1Q01KF2CTRL.LLN0.LocKey" />
			<DO name="PerTrgTms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="ExclTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="OpMod" type="AA1E1Q01KF2DR.RDRE1.OpMod" />
			<DO name="EPreLgt" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="ERcdLgt" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="EStoRte" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="EStoModPer" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="EStoModMan" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.IL1TCTR1" lnClass="TCTR">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Amp" type="AA1E1Q01KF2LD0.IL1TCTR1.Amp" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="ARtg" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="Cor" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="AngCor" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="ARtgSec" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="ARtgNom" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="VRtgSec" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="RevPol" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Alm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Wrn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.RESTCTR1" lnClass="TCTR">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Amp" type="AA1E1Q01KF2LD0.IL1TCTR1.Amp" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="ARtg" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="Cor" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="AngCor" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="ARtgSec" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="RevPol" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Alm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Wrn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.UL1TVTR1" lnClass="TVTR">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Vol" type="AA1E1Q01KF2LD0.IL1TCTR1.Amp" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="VRtg" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="Rat" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="Cor" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="AngCor" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="VRtgScy" type="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" />
			<DO name="VConnType" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="VInType" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Alm" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Wrn" type="AA1E1Q01KF2DR.RBDR1.EInput" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.OLYLTC1" lnClass="YLTC">
			<DO name="Mod" type="AA1E1Q01KF2DR.RDRE1.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="TapChg" type="AA1E1Q01KF2LD0.OLATCC1.TapChg" />
			<DO name="EndPosR" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="EndPosL" type="AA1E1Q01KF2DR.RBDR1.EInput" />
		</LNodeType>
		<LNodeType id="AA1E1Q01KF2LD0.OLATCC1" lnClass="ATCC">
			<DO name="Mod" type="AA1E1Q01KF2CTRL.LLN0.Mod" />
			<DO name="Beh" type="AA1E1Q01KF2CTRL.LLN0.Beh" />
			<DO name="Health" type="AA1E1Q01KF2CTRL.LLN0.Health" />
			<DO name="NamPlt" type="AA1E1Q01KF2DR.RADR1.NamPlt" />
			<DO name="Loc" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="OpCntRs" type="AA1E1Q01KF2LD0.FLTMSTA1.ActSG" />
			<DO name="TapChg" type="AA1E1Q01KF2LD0.OLATCC1.TapChg" />
			<DO name="ParOp" type="AA1E1Q01KF2LD0.OLATCC1.ParOp" />
			<DO name="LTCBlk" type="AA1E1Q01KF2LD0.LLN0.Act1SG" />
			<DO name="VRed1" type="AA1E1Q01KF2LD0.LLN0.Act1SG" />
			<DO name="CtlV" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="LodA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="CircA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="Auto" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="EndPosR" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="EndPosL" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="TapOpErr" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="TapOpR" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="TapOpL" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="BndCtr" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="BndWid" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="CtlDlTmms1" type="AA1E1Q01KF2LD0.OLATCC1.CtlDlTmms1" />
			<DO name="CtlDlTmms2" type="AA1E1Q01KF2LD0.OLATCC1.CtlDlTmms1" />
			<DO name="LDCR" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="LDCX" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="RnbkRV" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="LimLodA" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="VRedVal" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="TmDlChr" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="TapBlkR" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="TapBlkL" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="BlkVLo" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="ParTraMod" type="AA1E1Q01KF2LD0.OLATCC1.ParTraMod" />
			<DO name="LodPhAng" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="StabFact" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr" />
			<DO name="VCtlOpMod" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LTCPlsTmms" type="AA1E1Q01KF2DR.RDRE1.PerTrgTms" />
			<DO name="ManBlkTyp" type="AA1E1Q01KF2CTRL.LLN0.LocRemMod" />
			<DO name="LimCircA" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="LimLDC" type="AA1E1Q01KF2DR.RADR1.HiTrgLev" />
			<DO name="LDCEna" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="RPFAllw" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="OpTmhMax" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="CmdErrTms" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="FllwDlTms" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="RsCnt" type="AA1E1Q01KF2DR.RDRE1.RcdTrg" />
			<DO name="ALod" type="AA1E1Q01KF2LD0.OLATCC1.ALod" />
			<DO name="VMeas" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="AngVAPhA" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="CtlVDif" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="ClcLDC" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl" />
			<DO name="Tra1A" type="AA1E1Q01KF2LD0.OLATCC1.ALod" />
			<DO name="Tra2A" type="AA1E1Q01KF2LD0.OLATCC1.ALod" />
			<DO name="Tra3A" type="AA1E1Q01KF2LD0.OLATCC1.ALod" />
			<DO name="TapOpFllw1" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="TapOpFllw2" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="TapOpFllw3" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="CtlDlOn" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="CtlOpModSt" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="BlkSt" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="LTCBlkAHi" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="LTCBlkVLo" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="LTCRnbk" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="LTCBlkCirA" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="LTCBlkSt" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="AlmReas" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="FllwFlt" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="NumParUnit" type="AA1E1Q01KF2CTRL.LLN0.CmdRsp" />
			<DO name="ErrParTra" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="Tra1TapPos" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="Tra2TapPos" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="Tra3TapPos" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="TapChgFllw" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="InConSta" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="InLTCOp" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="AlmEna" type="AA1E1Q01KF2LD0.LLN0.HzAdEna" />
			<DO name="ParTraNum" type="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" />
			<DO name="TstOutCmd" type="AA1E1Q01KF2LD0.LLN0.CpySG" />
			<DO name="VolSpt" type="AA1E1Q01KF2LD0.OLATCC1.VolSpt" />
			<DO name="OpTmhNum" type="AA1E1Q01KF2DR.RADR1.EExclTRem" />
			<DO name="TapChgR" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="TapChgL" type="AA1E1Q01KF2DR.RBDR1.EInput" />
			<DO name="CtlDlSt" type="AA1E1Q01KF2DR.RBDR1.EInput" />
		</LNodeType>
		<DOType id="AA1E1Q01KF2LD0.LEDPTRC1.Str" cdc="ACD">
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
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.PHHPTOC1.Str" cdc="ACD">
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
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.SEQRFUF1.Str" cdc="ACD">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="dirGeneral" fc="ST" bType="Enum" type="dir" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.CCRDIF1.Op" cdc="ACT">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LEDPTRC1.Op" cdc="ACT">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="phsA" fc="ST" bType="BOOLEAN" />
			<DA name="phsB" fc="ST" bType="BOOLEAN" />
			<DA name="phsC" fc="ST" bType="BOOLEAN" />
			<DA name="neut" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.PHHPTOC1.Op" cdc="ACT">
			<DA name="general" fc="ST" bType="BOOLEAN" />
			<DA name="phsA" fc="ST" bType="BOOLEAN" />
			<DA name="phsB" fc="ST" bType="BOOLEAN" />
			<DA name="phsC" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.T2PTTR1.AlmThm" cdc="ACT">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.OLATCC1.VolSpt" cdc="APC">
			<DA name="mxVal" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl.mag" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="AA1E1Q01KF2LD0.OLATCC1.VolSpt.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="units" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.units" />
			<DA name="minVal" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="maxVal" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="stepSize" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.RADR1.HiTrgLev" cdc="ASG">
			<DA name="units" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.units" />
			<DA name="minVal" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="maxVal" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="stepSize" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="setMag" fc="SP" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.setMag" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LLN0.ACrvSatPnt" cdc="ASG">
			<DA name="minVal" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="maxVal" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="stepSize" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="setMag" fc="SP" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.setMag" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.OLATCC1.BndCtr" cdc="ASG">
			<DA name="units" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.units" />
			<DA name="minVal" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="maxVal" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="stepSize" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<DA name="setMag" fc="SE" bType="Struct" type="AA1E1Q01KF2LD0.OLATCC1.BndCtr.setMag" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.PEMMTR1.SupWh" cdc="BCR">
			<DA name="actVal" fc="ST" bType="INT32" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.units" />
			<DA name="pulsQty" fc="CF" bType="FLOAT32" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.OLATCC1.TapChg" cdc="BSC">
			<DA name="valWTr" fc="ST" bType="Struct" type="AA1E1Q01KF2LD0.OLATCC1.TapChg.valWTr" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="AA1E1Q01KF2LD0.OLATCC1.TapChg.Oper" />
			<DA name="persistent" fc="CF" bType="BOOLEAN" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="minVal" fc="CF" bType="INT8" />
			<DA name="maxVal" fc="CF" bType="INT8" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.CCRDIF1.DifAClc.res" cdc="CMV">
			<DA name="cVal" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.CCRDIF1.DifAClc.res.cVal" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.units" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.CMMXU1.A.phsA" cdc="CMV">
			<DA name="instCVal" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA.instCVal" />
			<DA name="cVal" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.CCRDIF1.DifAClc.res.cVal" />
			<DA name="range" fc="MX" bType="Enum" type="range" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.units" />
			<DA name="db" fc="CF" bType="INT32U" />
			<DA name="zeroDb" fc="CF" bType="INT32U" />
			<DA name="rangeC" fc="CF" bType="Struct" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA.rangeC" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.OLATCC1.ALod" cdc="CMV">
			<DA name="cVal" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA.instCVal" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.units" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.PHHPTOC1.TmACrv" cdc="CURVE">
			<DA name="setParA" fc="SP" bType="FLOAT32" />
			<DA name="setParB" fc="SP" bType="FLOAT32" />
			<DA name="setParC" fc="SP" bType="FLOAT32" />
			<DA name="setParD" fc="SP" bType="FLOAT32" />
			<DA name="setParE" fc="SP" bType="FLOAT32" />
			<DA name="setCharact" fc="SE" bType="Enum" type="setCharact" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.VMMXU1.PPV" cdc="DEL">
			<SDO name="phsAB" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA" />
			<SDO name="phsBC" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA" />
			<SDO name="phsCA" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.OLATCC1.ParOp" cdc="DPC">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2CTRL.LPHD1.PhyNam" cdc="DPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.IHMI1.EEName" cdc="DPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="hwRev" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="serNum" fc="DC" bType="VisString255" />
			<DA name="model" fc="DC" bType="VisString255" />
			<DA name="location" fc="DC" bType="VisString255" />
			<DA name="eArtNum" fc="EX" bType="VisString255" />
			<DA name="eManDate" fc="EX" bType="VisString255" />
			<DA name="eTestStatId" fc="EX" bType="VisString255" />
			<DA name="eTesterId" fc="EX" bType="VisString255" />
			<DA name="eTestDate" fc="EX" bType="VisString255" />
			<DA name="eHwId" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LPHD1.PhyNam" cdc="DPL">
			<DA name="tmDT" fc="ST" bType="BOOLEAN" />
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="hwRev" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="serNum" fc="DC" bType="VisString255" />
			<DA name="model" fc="DC" bType="VisString255" />
			<DA name="location" fc="DC" bType="VisString255" />
			<DA name="tmOffset" fc="DC" bType="INT16" />
			<DA name="tmUseDT" fc="DC" bType="BOOLEAN" />
			<DA name="eSwDate" fc="EX" bType="VisString255" />
			<DA name="eSwNum" fc="EX" bType="VisString255" />
			<DA name="eProdDate" fc="EX" bType="VisString255" />
			<DA name="eOrdNum" fc="EX" bType="VisString255" />
			<DA name="eCatNum" fc="EX" bType="VisString255" />
			<DA name="eConfName" fc="EX" bType="VisString255" />
			<DA name="eIedName" fc="EX" bType="VisString255" />
			<DA name="eBayName" fc="EX" bType="VisString255" />
			<DA name="eMacAddr" fc="EX" bType="VisString255" />
			<DA name="eMacAddr1" fc="EX" bType="VisString255" />
			<DA name="eCustomer" fc="EX" bType="VisString255" />
			<DA name="eStreet" fc="EX" bType="VisString255" />
			<DA name="eHouseNum" fc="EX" bType="VisString255" />
			<DA name="eZip" fc="EX" bType="VisString255" />
			<DA name="eCity" fc="EX" bType="VisString255" />
			<DA name="eState" fc="EX" bType="VisString255" />
			<DA name="eCountry" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2CTRL.LLN0.Mod" cdc="INC">
			<DA name="stVal" fc="ST" bType="Enum" type="Mod" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="AA1E1Q01KF2CTRL.LLN0.Mod.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="blockIn" fc="EX" bType="BOOLEAN" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.LLN0.Mod" cdc="INC">
			<DA name="stVal" fc="ST" bType="Enum" type="Mod" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="AA1E1Q01KF2CTRL.LLN0.Mod.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.RDRE1.Mod" cdc="INC">
			<DA name="stVal" fc="ST" bType="Enum" type="Mod" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LLN0.CpySG" cdc="INC">
			<DA name="stVal" fc="ST" bType="INT8" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.CpySG.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LLN0.ActSG" cdc="INC">
			<DA name="stVal" fc="ST" bType="INT32" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.ActSG.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="minVal" fc="CF" bType="INT32" />
			<DA name="maxVal" fc="CF" bType="INT32" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.FLTMSTA1.ActSG" cdc="INC">
			<DA name="stVal" fc="ST" bType="INT32" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LEDGGIO1.ISCSO1" cdc="INC">
			<DA name="stVal" fc="ST" bType="INT8" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.ActSG.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="minVal" fc="CF" bType="INT32" />
			<DA name="maxVal" fc="CF" bType="INT32" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.SPCGGIO1.Mod" cdc="INC">
			<DA name="stVal" fc="ST" bType="Enum" type="Mod" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="blockIn" fc="EX" bType="BOOLEAN" />
		</DOType>
		<DOType id="AA1E1Q01KF2CTRL.LLN0.LocRemMod" cdc="ING">
			<DA name="setVal" fc="SP" bType="INT8" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.RADR1.EChNum" cdc="ING">
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="setVal" fc="SP" bType="INT8" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.RBDR1.LevMod" cdc="ING">
			<DA name="setVal" fc="SP" bType="Enum" type="LevMod" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.RDRE1.PerTrgTms" cdc="ING">
			<DA name="minVal" fc="CF" bType="INT32" />
			<DA name="maxVal" fc="CF" bType="INT32" />
			<DA name="stepSize" fc="CF" bType="INT32U" />
			<DA name="setVal" fc="SP" bType="INT32" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.RDRE1.OpMod" cdc="ING">
			<DA name="setVal" fc="SP" bType="Enum" type="OpMod" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.GNRLLTMS1.PTPPrio1" cdc="ING">
			<DA name="minVal" fc="CF" bType="INT32" />
			<DA name="maxVal" fc="CF" bType="INT32" />
			<DA name="setVal" fc="SP" bType="INT32" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.OLATCC1.CtlDlTmms1" cdc="ING">
			<DA name="minVal" fc="CF" bType="INT32" />
			<DA name="maxVal" fc="CF" bType="INT32" />
			<DA name="stepSize" fc="CF" bType="INT32U" />
			<DA name="setVal" fc="SE" bType="INT32" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.OLATCC1.ParTraMod" cdc="ING">
			<DA name="setVal" fc="SE" bType="INT8" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.PHHPTOC1.TypRsCrv" cdc="ING">
			<DA name="setVal" fc="SE" bType="Enum" type="TypRsCrv" />
		</DOType>
		<DOType id="AA1E1Q01KF2CTRL.LLN0.Beh" cdc="INS">
			<DA name="stVal" fc="ST" bType="Enum" type="Beh" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="AA1E1Q01KF2CTRL.LLN0.Health" cdc="INS">
			<DA name="stVal" fc="ST" bType="Enum" type="Health" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="AA1E1Q01KF2CTRL.LLN0.CmdRsp" cdc="INS">
			<DA name="stVal" fc="ST" bType="INT8" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.RADR1.EExclTRem" cdc="INS">
			<DA name="stVal" fc="ST" bType="INT32" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.FLTMSTA1.ShotPntr" cdc="INS">
			<DA name="stVal" fc="ST" bType="INT32" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.GSAL1.AuthAcsA" cdc="INS">
			<DA name="stVal" fc="ST" bType="INT8" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="eIsView" fc="EX" bType="BOOLEAN" />
			<DA name="eIsOper" fc="EX" bType="BOOLEAN" />
			<DA name="eIsEng" fc="EX" bType="BOOLEAN" />
			<DA name="eIsAdmn" fc="EX" bType="BOOLEAN" />
			<DA name="eCanViewOper" fc="EX" bType="BOOLEAN" />
			<DA name="eCanViewSet" fc="EX" bType="BOOLEAN" />
			<DA name="eCanForce" fc="EX" bType="BOOLEAN" />
			<DA name="eCanChgSet" fc="EX" bType="BOOLEAN" />
			<DA name="eCanChgConf" fc="EX" bType="BOOLEAN" />
			<DA name="eCanFirmChg" fc="EX" bType="BOOLEAN" />
			<DA name="eCanPasswdMgmt" fc="EX" bType="BOOLEAN" />
			<DA name="eCanAuditRead" fc="EX" bType="BOOLEAN" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LPHD1.PhyHealth1" cdc="INS">
			<DA name="stVal" fc="ST" bType="Enum" type="Health" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LPHD1.PhyHealth2" cdc="INS">
			<DA name="stVal" fc="ST" bType="Enum" type="Health" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="debug" fc="EX" bType="VisString255" />
			<DA name="eDiag1" fc="EX" bType="INT32U" />
			<DA name="eDiag2" fc="EX" bType="INT32U" />
			<DA name="eDiag3" fc="EX" bType="INT32U" />
			<DA name="eDiag4" fc="EX" bType="INT32U" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.TPOSSLTC1.TapPos" cdc="ISC">
			<DA name="valWTr" fc="ST" bType="Struct" type="AA1E1Q01KF2LD0.OLATCC1.TapChg.valWTr" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2CTRL.LLN0.NamPlt" cdc="LPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="configRev" fc="DC" bType="VisString255" />
			<DA name="ldNs" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.RADR1.NamPlt" cdc="LPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LLN0.NamPlt" cdc="LPL">
			<DA name="paramRev" fc="ST" bType="INT32" />
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="configRev" fc="DC" bType="VisString255" />
			<DA name="ldNs" fc="EX" bType="VisString255" />
			<DA name="eIp" fc="EX" bType="VisString255" />
			<DA name="eIpSubNet" fc="EX" bType="VisString255" />
			<DA name="eIpGateWay" fc="EX" bType="VisString255" />
			<DA name="eIpFront" fc="EX" bType="VisString255" />
			<DA name="eIpSNTPpri" fc="EX" bType="VisString255" />
			<DA name="eIpSNTPsec" fc="EX" bType="VisString255" />
			<DA name="eLang" fc="EX" bType="VisString255" />
			<DA name="eFD" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.GNRLLTMS1.NamPlt" cdc="LPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="mstrId" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.MMSGGIO1.NamPlt" cdc="LPL">
			<DA name="vendor" fc="DC" bType="VisString255" />
			<DA name="swRev" fc="DC" bType="VisString255" />
			<DA name="d" fc="DC" bType="VisString255" />
			<DA name="eIp1" fc="EX" bType="VisString255" />
			<DA name="eIp2" fc="EX" bType="VisString255" />
			<DA name="eIp3" fc="EX" bType="VisString255" />
			<DA name="eIp4" fc="EX" bType="VisString255" />
			<DA name="eIp5" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LLN0.SvMaxDl" cdc="MV">
			<DA name="mag" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl.mag" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.units" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.PEMMXU1.TotW" cdc="MV">
			<DA name="instMag" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl.mag" />
			<DA name="mag" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl.mag" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.units" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.XRGGIO130.AnIn1" cdc="MV">
			<DA name="instMag" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl.mag" />
			<DA name="mag" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl.mag" />
			<DA name="range" fc="MX" bType="Enum" type="range" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="t" fc="MX" bType="Timestamp" />
			<DA name="units" fc="CF" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.units" />
			<DA name="db" fc="CF" bType="INT32U" />
			<DA name="rangeC" fc="CF" bType="Struct" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA.rangeC" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.IL1TCTR1.Amp" cdc="SAV">
			<DA name="instMag" fc="MX" bType="Struct" type="AA1E1Q01KF2LD0.IL1TCTR1.Amp.instMag" />
			<DA name="q" fc="MX" bType="Quality" />
			<DA name="sVC" fc="CF" bType="Struct" type="AA1E1Q01KF2LD0.IL1TCTR1.Amp.sVC" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.GSAL1.AuthFail" cdc="SEC">
			<DA name="cnt" fc="ST" bType="INT32U" />
			<DA name="sev" fc="ST" bType="Enum" type="sev" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.CSMSQI1.SeqA" cdc="SEQ">
			<SDO name="c1" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA" />
			<SDO name="c2" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA" />
			<SDO name="c3" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA" />
			<DA name="seqT" fc="MX" bType="Enum" type="seqT" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2CTRL.LLN0.LocSta" cdc="SPC">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.RDRE1.RcdTrg" cdc="SPC">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="AA1E1Q01KF2DR.RDRE1.RcdTrg.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LLN0.Act1SG" cdc="SPC">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.MMSGGIO1.SGConfMod" cdc="SPC">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="AA1E1Q01KF2DR.RDRE1.RcdTrg.Oper" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1" cdc="SPC">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="Oper" fc="CO" bType="Struct" type="AA1E1Q01KF2DR.RDRE1.RcdTrg.Oper" />
			<DA name="pulseConfig" fc="CF" bType="Struct" type="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1.pulseConfig" />
			<DA name="ctlModel" fc="CF" bType="Enum" type="ctlModel" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.LLN0.HzAdEna" cdc="SPG">
			<DA name="setVal" fc="SP" bType="BOOLEAN" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.GSAL1.AuthLoc" cdc="SPG">
			<DA name="setVal" fc="SP" bType="BOOLEAN" />
			<DA name="pwdAdmin" fc="EX" bType="VisString255" />
			<DA name="pwdEng" fc="EX" bType="VisString255" />
			<DA name="pwdOper" fc="EX" bType="VisString255" />
			<DA name="pwdView" fc="EX" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2CTRL.LLN0.LocKey" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
		</DOType>
		<DOType id="AA1E1Q01KF2DR.RBDR1.EInput" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.IHMI1.LocClk" cdc="SPS">
			<DA name="stVal" fc="ST" bType="BOOLEAN" />
			<DA name="q" fc="ST" bType="Quality" />
			<DA name="t" fc="ST" bType="Timestamp" />
			<DA name="time" fc="EX" bType="VisString255" />
			<DA name="date" fc="EX" bType="VisString255" />
			<DA name="timeSpring" fc="EX" bType="VisString255" />
			<DA name="dateSpring" fc="EX" bType="VisString255" />
			<DA name="offsetSpring" fc="EX" bType="INT16" />
			<DA name="daySpring" fc="EX" bType="INT8" />
			<DA name="timeAutumn" fc="EX" bType="VisString255" />
			<DA name="dateAutumn" fc="EX" bType="VisString255" />
			<DA name="dayAutumn" fc="EX" bType="INT8" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.CCRDIF1.DifAClc" cdc="WYE">
			<SDO name="res" type="AA1E1Q01KF2LD0.CCRDIF1.DifAClc.res" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.CMMXU1.A" cdc="WYE">
			<SDO name="phsA" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA" />
			<SDO name="phsB" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA" />
			<SDO name="phsC" type="AA1E1Q01KF2LD0.CMMXU1.A.phsA" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DOType id="AA1E1Q01KF2LD0.VMMXU1.PhV" cdc="WYE">
			<SDO name="phsA" type="AA1E1Q01KF2LD0.OLATCC1.ALod" />
			<SDO name="phsB" type="AA1E1Q01KF2LD0.OLATCC1.ALod" />
			<SDO name="phsC" type="AA1E1Q01KF2LD0.OLATCC1.ALod" />
			<DA name="d" fc="DC" bType="VisString255" />
		</DOType>
		<DAType id="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal">
			<BDA name="f" bType="FLOAT32" />
		</DAType>
		<DAType id="AA1E1Q01KF2DR.RADR1.HiTrgLev.setMag">
			<BDA name="f" bType="FLOAT32" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.LLN0.SvMaxDl.mag">
			<BDA name="f" bType="FLOAT32" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.IL1TCTR1.Amp.instMag">
			<BDA name="i" bType="INT32" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.OLATCC1.BndCtr.setMag">
			<BDA name="f" bType="FLOAT32" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.OLATCC1.VolSpt.Oper.ctlVal">
			<BDA name="f" bType="FLOAT32" />
		</DAType>
		<DAType id="AA1E1Q01KF2CTRL.LLN0.Mod.Oper.origin">
			<BDA name="orCat" bType="Enum" type="orCategory" />
			<BDA name="orIdent" bType="Octet64" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.SPCGGIO1.SPCSO1.pulseConfig">
			<BDA name="cmdQual" bType="Enum" type="ControlOutputKind" />
			<BDA name="onDur" bType="INT32U" />
			<BDA name="offDur" bType="INT32U" />
			<BDA name="numPls" bType="INT32U" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.CMMXU1.A.phsA.rangeC">
			<BDA name="hhLim" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<BDA name="hLim" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<BDA name="lLim" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<BDA name="llLim" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<BDA name="min" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
			<BDA name="max" bType="Struct" type="AA1E1Q01KF2DR.RADR1.HiTrgLev.minVal" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.IL1TCTR1.Amp.sVC">
			<BDA name="scaleFactor" bType="FLOAT32" />
			<BDA name="offset" bType="FLOAT32" />
		</DAType>
		<DAType id="AA1E1Q01KF2DR.RADR1.HiTrgLev.units">
			<BDA name="SIUnit" bType="Enum" type="SIUnit" />
			<BDA name="multiplier" bType="Enum" type="multiplier" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.OLATCC1.TapChg.valWTr">
			<BDA name="posVal" bType="INT8" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.CCRDIF1.DifAClc.res.cVal">
			<BDA name="mag" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl.mag" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.CMMXU1.A.phsA.instCVal">
			<BDA name="mag" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl.mag" />
			<BDA name="ang" bType="Struct" type="AA1E1Q01KF2LD0.LLN0.SvMaxDl.mag" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.OLATCC1.VolSpt.Oper">
			<BDA name="ctlVal" bType="Struct" type="AA1E1Q01KF2LD0.OLATCC1.VolSpt.Oper.ctlVal" />
			<BDA name="origin" bType="Struct" type="AA1E1Q01KF2CTRL.LLN0.Mod.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
			<BDA name="Check" bType="Check" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.OLATCC1.TapChg.Oper">
			<BDA name="ctlVal" bType="Tcmd" />
			<BDA name="origin" bType="Struct" type="AA1E1Q01KF2CTRL.LLN0.Mod.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
			<BDA name="Check" bType="Check" />
		</DAType>
		<DAType id="AA1E1Q01KF2DR.RDRE1.RcdTrg.Oper">
			<BDA name="ctlVal" bType="BOOLEAN" />
			<BDA name="origin" bType="Struct" type="AA1E1Q01KF2CTRL.LLN0.Mod.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
			<BDA name="Check" bType="Check" />
		</DAType>
		<DAType id="AA1E1Q01KF2CTRL.LLN0.Mod.Oper">
			<BDA name="ctlVal" bType="Enum" type="Mod" />
			<BDA name="origin" bType="Struct" type="AA1E1Q01KF2CTRL.LLN0.Mod.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
			<BDA name="Check" bType="Check" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.LLN0.CpySG.Oper">
			<BDA name="ctlVal" bType="INT8" />
			<BDA name="origin" bType="Struct" type="AA1E1Q01KF2CTRL.LLN0.Mod.Oper.origin" />
			<BDA name="ctlNum" bType="INT8U" />
			<BDA name="T" bType="Timestamp" />
			<BDA name="Test" bType="BOOLEAN" />
			<BDA name="Check" bType="Check" />
		</DAType>
		<DAType id="AA1E1Q01KF2LD0.LLN0.ActSG.Oper">
			<BDA name="ctlVal" bType="INT32" />
			<BDA name="origin" bType="Struct" type="AA1E1Q01KF2CTRL.LLN0.Mod.Oper.origin" />
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
		<EnumType id="dir">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="0">unknown</EnumVal>
			<EnumVal ord="1">forward</EnumVal>
			<EnumVal ord="2">backward</EnumVal>
			<EnumVal ord="3">both</EnumVal>
		</EnumType>
		<EnumType id="sev">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="0">unknown</EnumVal>
			<EnumVal ord="1">critical</EnumVal>
			<EnumVal ord="2">major</EnumVal>
			<EnumVal ord="3">minor</EnumVal>
			<EnumVal ord="4">warning</EnumVal>
		</EnumType>
		<EnumType id="range">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="0">normal</EnumVal>
			<EnumVal ord="1">high</EnumVal>
			<EnumVal ord="2">low</EnumVal>
			<EnumVal ord="3">high-high</EnumVal>
			<EnumVal ord="4">low-low</EnumVal>
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
		<EnumType id="setCharact">
			<!--Source: IEC 61850-7-3:2003-->
			<EnumVal ord="0"></EnumVal>
			<EnumVal ord="1">ANSI Extremly Inverse</EnumVal>
			<EnumVal ord="2">ANSI Very Inverse</EnumVal>
			<EnumVal ord="3">ANSI Normal Inverse</EnumVal>
			<EnumVal ord="4">ANSI Moderate Inverse</EnumVal>
			<EnumVal ord="5">ANSI Definite Time</EnumVal>
			<EnumVal ord="6">Long-Time Extremely Inverse</EnumVal>
			<EnumVal ord="7">Long-Time Very Inverse</EnumVal>
			<EnumVal ord="8">Long-Time Inverse</EnumVal>
			<EnumVal ord="9">IEC Normal Inverse</EnumVal>
			<EnumVal ord="10">IEC Very Inverse</EnumVal>
			<EnumVal ord="11">IEC Inverse</EnumVal>
			<EnumVal ord="12">IEC Extremely Inverse</EnumVal>
			<EnumVal ord="13">IEC Short-Time Inverse</EnumVal>
			<EnumVal ord="14">IEC Long-Time Inverse</EnumVal>
			<EnumVal ord="15">IEC Definite Time</EnumVal>
			<EnumVal ord="16">Reserved</EnumVal>
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
		<EnumType id="LevMod">
			<!--Source: IEC 61850-7-4:2003-->
			<EnumVal ord="1">Positive or Rising</EnumVal>
			<EnumVal ord="2">Negative or Falling</EnumVal>
			<EnumVal ord="3">Both</EnumVal>
			<EnumVal ord="4">Other</EnumVal>
		</EnumType>
		<EnumType id="Mod">
			<!--Source: IEC 61850-7-4:2003-->
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
		<EnumType id="OpMod">
			<!--Source: IEC 61850-7-4:2003-->
			<EnumVal ord="1">Overwrite existing values</EnumVal>
			<EnumVal ord="2">Stop when full or saturated</EnumVal>
		</EnumType>
		<EnumType id="TypRsCrv">
			<!--Source: IEC 61850-7-4:2003-->
			<EnumVal ord="1">None</EnumVal>
			<EnumVal ord="2">Definit Time Delayed Reset</EnumVal>
			<EnumVal ord="3">Inverse Reset</EnumVal>
		</EnumType>
	</DataTypeTemplates>
</SCL>

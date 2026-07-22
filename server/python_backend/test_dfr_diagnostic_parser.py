import unittest


from api import parse_dfr_diagnostic_report


class DfrDiagnosticParserTest(unittest.TestCase):
    def test_extracts_memory_and_storage(self):
        xml_text = """<?xml version="1.0"?>
<Diagnostic_Report>
  <Station_Name Value="STRING64">GIS NEW TAMBUN</Station_Name>
  <Device_Name Value="STRING64">TAMBUN 1-2</Device_Name>
  <Memory_Usage>
    <Volatile>
      <Total_RAM Size_in_MB="FLOAT32">250.656250</Total_RAM>
      <Free_RAM Size_in_MB="FLOAT32">3.742188</Free_RAM>
      <Percentage_Memory_Used percentage="FLOAT32">98.507042</Percentage_Memory_Used>
    </Volatile>
    <Non_Volatile1>
      <Mounted_On PATH="STRING16">/home</Mounted_On>
      <Used Size_in_KB="STRING16">279528</Used>
      <Available Size_in_KB="STRING16">27315284</Available>
      <Percentage_use percentage="STRING16">1%</Percentage_use>
    </Non_Volatile1>
    <Non_Volatile2>
      <Mounted_On PATH="STRING16">/home/logs</Mounted_On>
      <Used Size_in_KB="STRING16">34540</Used>
      <Available Size_in_KB="STRING16">1428856</Available>
      <Percentage_use percentage="STRING16">2%</Percentage_use>
    </Non_Volatile2>
  </Memory_Usage>
</Diagnostic_Report>
"""

        result = parse_dfr_diagnostic_report(xml_text)

        self.assertEqual(result["station_name"], "GIS NEW TAMBUN")
        self.assertEqual(result["device_name"], "TAMBUN 1-2")
        self.assertEqual(result["ram"]["used_percent"], 98.507042)
        self.assertEqual(result["ram"]["free_mb"], 3.742188)
        self.assertEqual(result["storage"][0]["mount"], "/home")
        self.assertEqual(result["storage"][0]["used_percent"], 1.0)
        self.assertEqual(result["storage"][1]["mount"], "/home/logs")
        self.assertEqual(result["storage"][1]["available_kb"], 1428856)


if __name__ == "__main__":
    unittest.main()

using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace Wgrywanie_Oprogramowania_JH
{
    public partial class Form3 : Form
    {
        public Form3()
        {
            InitializeComponent();
        }
        string request, strName;
        Process MyProcess = new Process();
        private void Button1_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void Button2_Click(object sender, EventArgs e)
        {
            DriveInfo[] allDrives = DriveInfo.GetDrives();


            if (allDrives[2].IsReady && allDrives[2].Name == "E:\\")
            {
    
                        if (System.IO.Directory.Exists(@"E:\"))
                        {
                            try
                            {
                                System.IO.Directory.Delete(@"E:\", true);
                            }

                            catch (System.IO.IOException x)
                            {
                                
                            }
                        
            }else
            {
                var result = MessageBox.Show("Nie włożono karty SD !!!", "UWAGA", MessageBoxButtons.OK, MessageBoxIcon.Error);  
            }


        }


    }
}

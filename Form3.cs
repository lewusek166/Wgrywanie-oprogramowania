using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace Wgrywanie_Oprogramowania_JH
{
    public partial class Form3 : Form
    {
        int etap;
        public Form3()
        {
            etap = 1;
            InitializeComponent();
            progressBar1.
        }
       
        private void Button1_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }
        private static void CopyFilesRecursively(string sourcePath, string targetPath)
        {
            
            foreach (string dirPath in Directory.GetDirectories(sourcePath, "*", SearchOption.AllDirectories))
            {
                Directory.CreateDirectory(dirPath.Replace(sourcePath, targetPath));
            }

            
            foreach (string newPath in Directory.GetFiles(sourcePath, "*.*", SearchOption.AllDirectories))
            {
                File.Copy(newPath, newPath.Replace(sourcePath, targetPath), true);
            }
        }
        private void Button2_Click(object sender, EventArgs e)
        {
            if (etap == 1)
            {
               DriveInfo[] allDrives = DriveInfo.GetDrives();

            if (allDrives[2].IsReady && allDrives[2].Name == "E:\\")
            {
                if (System.IO.Directory.Exists(@"E:\"))
                {
                        etap++;
                        try
                    {
                        System.IO.Directory.Delete(@"E:\", true);
                        
                    }
                    catch (System.IO.IOException x)
                    {
                    }
                }
            }
            else
            {
                var result = MessageBox.Show("Nie włożono karty SD !!!", "UWAGA", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
                
            }
            if (etap == 2)
            {
                checkBox1.BackColor = System.Drawing.Color.Green;
                label1.Text = "Poczekaj aż zostaną wgrane dane na kartę SD";
                CopyFilesRecursively(@"C:\beckhoff\", @"E:\");



            }



        }
    }
}

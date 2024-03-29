const spawnSync = require("child_process").spawnSync;
const path = require("path");
const fs = require("fs-extra");

const {
  OUTPUT_AVS_IN_CUT,
  OUTPUT_AVS_IN_CUT_LOGO,
} = require("../settings");

exports.exec = (encoder, save_dir, save_name, target, encoder_option) => {
  const args = ["-i"];

  if (target == "cutcm") {
    args.push(OUTPUT_AVS_IN_CUT);
  }else{
    args.push(OUTPUT_AVS_IN_CUT_LOGO);
  }
  if (encoder_option) {
    const option_args=encoder_option.split(' ');
    for(let i = 0; i < option_args.length; i++){
      if(option_args[i]){
        args.push(option_args[i]);
      } 
    }
  }
  // QSVEnccなどでは出力パスの前に"-o"が必要なので、jlse実行時のoptionの末尾に"-o"を含めること
  args.push(path.join(save_dir,`${save_name}.mp4`));
  //console.log(args);
  try {
    spawnSync(encoder, args, { stdio: "inherit" });
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
};

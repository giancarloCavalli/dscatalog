import './styles.css';

import ArrowIcon from 'assets/images/arrow.svg';

const ButtonIcon = () => {
  return (
    <div className="btn-container">
      <button className="btn btn-primary">
        INICIE AGORA A sua BUSCA
      </button>
      <div className="btn-icon-container">
        <img src={ArrowIcon} alt="Seta do botão de busca" />
      </div>
    </div>
  );
};

export default ButtonIcon;

import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const DropdownIcon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
    </svg>
  );
};

const CloseDropdownIcon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
    </svg>
  );
};

const CustomDropdown = ({
  placeholder ="Enter name",
  options,
  isMulti,
  isSearchable,
  onChange
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValues, setSelectedValues] = useState(isMulti ? [] : null);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    setSearchValue("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  const handleInputClick = () => {
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (!selectedValues || selectedValues.length === 0) {
      return placeholder;
    }
    if (isMulti) {
      return (
        <div className="dropdown-tags">
          {selectedValues.map((names) => (
            <div key={names.fname} className="dropdown-tag-item">
              {names.fname + " " + names.lname}
              <span
                onClick={(e) => onTagRemove(e, names)}
                className="dropdown-tag-close"
              >
                <CloseDropdownIcon />
              </span>
            </div>
          ))}
        </div>
      );
    }
    return selectedValues.lname;
  };

  const removeOption = (names) => {
    return selectedValues.filter((o) => o.fname !== names.fname);
  };

  const onTagRemove = (e, names) => {
    e.stopPropagation();
    const newValue = removeOption(names);
    setSelectedValues(newValue);
    onChange(newValue);
  };

  const onItemClick = (names) => {
    let newValue;
    if (isMulti) {
      if (selectedValues.findIndex((o) => o.fname === names.fname) >= 0) {
        newValue = removeOption(names);
      } else {
        newValue = [...selectedValues, names];
      }
    } else {
      newValue = names;
    }
    setSelectedValues(newValue);
    onChange(newValue);
  };

  const isSelected = (names) => {
    if (isMulti) {
      return (
        selectedValues.filter((o) => o.fname === names.fname).length > 0
      );
    }

    if (!selectedValues) {
      return false;
    }

    return selectedValues.fname === names.fname;
  };

  const onSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const getOptions = () => {
    if (!searchValue) {
      return options.filter(
        (names) =>
          !selectedValues ||
          selectedValues.every(
            (selected) => selected.fname !== names.fname
          )
      );
    }

    return options.filter(
      (names) =>
        (names.fname + " " + names.lname)
          .toLowerCase()
          .includes(searchValue.toLowerCase()) &&
        (!selectedValues ||
          selectedValues.every(
            (selected) => selected.fname !== names.fname
          ))
    );
  };

  return (
    <div className="dropdown-container">
      <div ref={inputRef} onClick={handleInputClick} className="dropdown-input">
        <div className="dropdown-selected-value">{getDisplay()}</div>
        <div className="dropdown-tools">
          <div className="dropdown-tool">
            <DropdownIcon />
          </div>
        </div>
      </div>
      {showMenu && (
        <div className="dropdown-menu">
          {isSearchable && (
            <div className="search-box">
              <input
                placeholder="Search..."
                onChange={onSearch}
                value={searchValue}
                ref={searchRef}
              />
            </div>
          )}
          {getOptions().map((names) => (
            <div
              onClick={() => onItemClick(names)}
              key={names.fname}
              className={`dropdown-item ${isSelected(names) && "selected"}`}
            >
              {names.fname + " " + names.lname}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
